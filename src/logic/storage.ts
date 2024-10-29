import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'

interface GithubActivityConfig {
  isCustomService: boolean
  customService: string
}

function getDefaultConfig(): GithubActivityConfig {
  return {
    isCustomService: false,
    customService: '',
  }
}

export const storageConfig = useWebExtensionStorage('github-activity-config', getDefaultConfig())
