import { window, workspace } from 'vscode'
import { ColorCustomizationsRepository } from './colorCustomizations'
import { Config } from './config'

const CheckOpenFolder = (
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) => {
  const delegate = descriptor.value
  descriptor.value = function () {
    const folders = workspace.workspaceFolders
    if (folders === undefined) {
      window.showInformationMessage('run in workspace or folder')
      return
    }
    return delegate.apply(this, arguments)
  }
  return descriptor
}

const calcNextColor = (
  current: string | null,
  config: Config
): Object | null => {
  if (!current) {
    return Object.values(config.colorList())[0]
  }
  const list = Object.values(config.colorList())
  const index = list.indexOf(current)
  if (index == -1) {
    return null
  }
  return list[index + 1] || list[0]
}

export class Usecase {
  constructor(
    private ccRepository: ColorCustomizationsRepository,
    private config: Config
  ) {}

  @CheckOpenFolder
  nextColor() {
    const customizations = this.customizations
    const next = calcNextColor(customizations.color()[0], this.config)
    if (!next) {
      window.showWarningMessage('already use your own settings')
      return
    }
    this.customizations = customizations.assign(next)
  }

  @CheckOpenFolder
  async setColor() {
    const color: string | undefined = await window.showQuickPick(
      Object.keys(this.config.colorList())
    )
    if (!color) return

    let cc = (this.config.colorList() as any)[color]
    this.customizations = this.customizations.assign(cc)
  }

  @CheckOpenFolder
  resetColor() {
    this.customizations = this.customizations.reset()
  }

  private get customizations() {
    return this.ccRepository.for(this.config.targetTheme())
  }
  private set customizations(customizations: any) {
    this.ccRepository.update(customizations)
  }
  configChange(): void {}
}
