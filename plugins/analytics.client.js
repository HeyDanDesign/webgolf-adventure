export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    // Asynchronously load the Google Analytics script
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-LNQW7F26QB'
    document.head.appendChild(script)

    // Once the script is loaded, initialize gtag
    script.onload = () => {
      window.dataLayer = window.dataLayer || []
      function gtag() {
        dataLayer.push(arguments)
      }
      gtag('js', new Date())
      gtag('config', 'G-LNQW7F26QB')
    }
  }
})
