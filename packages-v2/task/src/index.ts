//
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
//

import { plugin, Plugin, Service, StringProperty, VDoc } from '@anticrm/platform'
import ui, { AnyComponent, Asset } from '@anticrm/platform-ui'
import presentationCore from '@anticrm/presentation-core'

export interface Task extends VDoc {
  name: StringProperty
  description: StringProperty
}

export default plugin('task' as Plugin<Service>, { ui: ui.id, presentationCore: presentationCore.id }, {
  icon: {
    Task: '' as Asset,
  },
  component: {
    Main: '' as AnyComponent,
    TaskDetails: '' as AnyComponent
  }
})
