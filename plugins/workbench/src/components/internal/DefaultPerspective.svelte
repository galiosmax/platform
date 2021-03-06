<!--
// Copyright © 2020 Anticrm Platform Contributors.
// 
// Licensed under the Eclipse Public License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License. You may
// obtain a copy of the License at https://www.eclipse.org/legal/epl-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// 
// See the License for the specific language governing permissions and
// limitations under the License.
-->

<script lang="ts">
  import { Ref, Space, Doc, Class, VDoc } from '@anticrm/core'
  import { onDestroy } from 'svelte'
  import { find, getCoreService, getUIService } from '../../utils'
  import core from '@anticrm/platform-core'
  import ui from '@anticrm/platform-ui'
  import workbench, { WorkbenchApplication } from '../..'

  import LinkTo from '@anticrm/platform-ui/src/components/LinkTo.svelte'
  import Icon from '@anticrm/platform-ui/src/components/Icon.svelte'

  import { AnyComponent } from '@anticrm/platform-ui';

  import CreateSpace from './CreateSpace.svelte'
  import MainComponent from '../proxies/MainComponent.svelte'
  
  import ObjectForm from './ObjectForm.svelte'

  const uiService = getUIService()

  let location: string[]
  const locationStore = uiService.getLocation()
  locationStore.subscribe(loc => {
    location = loc.pathname.split('/')
  })

  let space: Ref<Space>
  let spaces: Space[] = []
  let spaceUnsubscribe: () => void | undefined

  getCoreService()
    .then(coreService => coreService.query(core.class.Space, {}))
    .then(qr => { spaceUnsubscribe = qr.subscribe(docs => { spaces = docs }) })

  onDestroy(() => { if (spaceUnsubscribe) spaceUnsubscribe() })

  let application: Ref<WorkbenchApplication>
  let applications: WorkbenchApplication[] = []
  find(workbench.class.WorkbenchApplication, {}).then(docs => {applications = docs})

  let component: AnyComponent | undefined

  $: {
    space = location[3] as Ref<Space>
    if (!application) {
      application = workbench.application.Activity
    }
    component = applications.find(a => a._id === application)?.component
  }

  function id<T extends Doc>(doc: T): Ref<T> { return doc._id as Ref<T> }

  let details: { _id: Ref<VDoc>, _class: Ref<Class<VDoc>> }

</script>

<div class="workbench-perspective">
  <div class="projects">
    <div class="caption-3">
      Пространства
      <a href="/" on:click|preventDefault = { () => { uiService.showModal(CreateSpace, {}) } }>
        <Icon icon={ui.icon.Add} clazz="icon-embed"/>
      </a>
    </div>
    <div class="project" class:selected={!space}>
      <LinkTo href={'/' + location[1] + '/' + location[2]}><b>Все</b></LinkTo>
    </div>
    { #each spaces as s (s._id) }
      <div class="project" class:selected={s._id === space}>
        <LinkTo href={'/' + location[1] + '/' + location[2] + '/' + s._id}>#{s.name}</LinkTo>
      </div>
    { /each }

    <div class="caption-3">Приложения</div>
    { #each applications as app (app._id) }
    <div class="app" class:selected={app._id === application}>
      <a href='/' on:click|preventDefault={ e => { application = id(app) } }>{app.label}</a>
    </div>
    { /each}
  </div>

  <div class="main">
    <!-- <div class="main-content"> -->
      { #if component}
        <MainComponent is = {component} {application} {space} on:open = { e => {details = e.detail} }/>
      { /if }
    <!-- </div>
    <div class="input-control">
      <InputControl />
    </div> -->
  </div>

  <aside>
    <!-- <DetailsForm v-if="details" :_class="details._class" :_id="details._id" @done="done" /> -->
    { #if details }
    <ObjectForm {...details} title="Title"/>
    { /if }
  </aside>
</div>

<style lang="scss">

.workbench-perspective {
  display: flex;
  height: 100%;
}

.projects {
  padding: 1em;
  width: 20em;
  overflow-y: auto;

  border-right: 1px solid var(--theme-separator-color);

  .project {
    font-family: Raleway;
    padding: 0.5em;
    &.selected {
      // color: var(--theme-content-bg-color);
      background-color: var(--theme-content-color-dark);
    }
    a {
      text-decoration: none;
    }
  }

  .app {
    font-family: Raleway;
    padding: 0.5em;
    &.selected {
      background-color: var(--theme-content-color-dark);
    }
  }  
}

.main {
  width: 100%;
  height: 100%;
  // background-color: blue;
  // display: flex;
  // flex-direction: column;

  // .main-content {
  //   height: 100%;
    // flex-grow: 2;
    // align-items: stretch;
  //   background-color: blue;
  // }
  
  // .input-control {
  //   padding: 1em;
  //   max-height: 400px;
  // }
}

aside {
  background-color: var(--theme-nav-color);
  border-left: 1px solid var(--theme-separator-color);
}
</style>

