import { workspace } from 'vscode'

const orThrow = <T>(val: T | undefined | null): T => {
  if (!val) {
    throw new Error('npo')
  }
  return val
}

export class Config {
  private conf() {
    return workspace.getConfiguration('workspaceColor')
  }
  colorList(): Object {
    var colorList = orThrow(
      this.conf().get<object>('colorList') || {
        Orange: '#f39700',
        Red: '#e60012',
        Gray: '#9caeb7',
        Sky: '#00a7db',
        Green: '#009944',
        Mustard: '#d7c447',
        Purple: '#9b7cb6',
        Teal: '#00ada9',
        Bronze: '#bb641d',
        Pink: '#e85298',
        Blue: '#0079c2',
      }
    )
    return colorList
  }
  targetTheme(): string[] {
    var targetTheme = orThrow(
      this.conf().get<string[]>('targetTheme') || ['activityBar.background']
    )
    return targetTheme
  }
}
