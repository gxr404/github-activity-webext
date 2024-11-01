/* eslint-disable no-console */
import { onMessage } from 'webext-bridge/content-script'
import { createApp } from 'vue'
import App from './views/App.vue'
import { setupApp } from '~/logic/common-setup'

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  // communication example: send previous tab title from background page
  onMessage('tab-prev', ({ data }) => {
    console.log(`[vitesse-webext] Navigate from page "${data.title}"`)
  })
  if (document.querySelector('body')) {
    watchDom(document.querySelector('body') as Element, () => {
      console.log(`[${__NAME__}]: watch DOM`)
      main()
    })
    main()
  }
})()

function main() {
  const followingContainer = document.querySelector('.js-profile-editable-replace .user-following-container')
  const userProfileContainer = document.querySelector('.js-profile-editable-replace .js-profile-editable-edit-button')?.parentElement
  if (!followingContainer && !userProfileContainer)
    return
  if (document.getElementById(__NAME__))
    return

  console.log(`[${__NAME__}]: followingContainer`, followingContainer)
  console.log(`[${__NAME__}]: userProfileContainer`, userProfileContainer)
  const targetContainer = followingContainer || userProfileContainer
  if (!targetContainer)
    return
  const container = document.createElement('div')
  container.id = __NAME__
  const root = document.createElement('div')
  const styleEl = document.createElement('link')
  // const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
  const shadowDOM = container
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(root)
  targetContainer.appendChild(container)
  const app = createApp(App)
  setupApp(app)
  app.mount(root)
}

function watchDom(dom: Element, callback: () => void) {
  const observer = new MutationObserver(() => {
    callback()
  })
  observer.observe(dom, {
    childList: true,
  })
}
