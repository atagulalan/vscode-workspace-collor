'use strict'
import { workspace } from 'vscode'

class ColorCustomizations {
  constructor(
    private customizations: { [key: string]: any } | any,
    private propName: string[]
  ) {}
  color(): (string | null)[] {
    return this.propName.map(
      (item) => (this.customizations[item] as string) || null
    )
  }
  reset() {
    const cc = Object.assign({}, this.customizations)
    this.propName.forEach((item) => {
      delete cc[item]
    })
    return new ColorCustomizations(cc, this.propName)
  }
  assign(color: string) {
    return new ColorCustomizations(
      Object.assign(
        this.customizations,
        ...this.propName.map((item) => ({
          [item]: color,
        }))
      ),
      this.propName
    )
  }
  forUpdate(): {} | undefined {
    return Object.keys(this.customizations).length == 0
      ? undefined
      : this.customizations
  }
}

export class ColorCustomizationsRepository {
  for(propName: string[]): ColorCustomizations {
    console.log(propName)
    const customizations =
      workspace.getConfiguration('workbench').get('colorCustomizations') || {}
    return new ColorCustomizations(customizations, propName)
  }
  update(customizations: ColorCustomizations) {
    const update = customizations.forUpdate()
    workspace
      .getConfiguration('workbench')
      .update('colorCustomizations', update, false)
  }
}
