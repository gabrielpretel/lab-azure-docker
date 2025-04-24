export const useTransitions = () => {
  const beforeEnter = (el: Element) => {
    const htmlEl = el as HTMLElement
    document.body.style.overflow = 'hidden'
    htmlEl.style.height = `50px`
    htmlEl.style.opacity = '0.5'
  }

  const enter = (el: Element) => {
    const htmlEl = el as HTMLElement
    document.body.style.overflow = 'hidden'
    const height = htmlEl.scrollHeight
    htmlEl.style.transition = 'height 0.5s ease, opacity 0.5s ease'
    htmlEl.style.height = `${height}px`
    htmlEl.style.opacity = '1'

    htmlEl.addEventListener(
      'transitionend',
      () => {
        document.body.style.overflow = ''
      },
      { once: true },
    )
  }

  const leave = (el: Element) => {
    const htmlEl = el as HTMLElement
    document.body.style.overflow = 'hidden'
    htmlEl.style.transition = 'height 0.5s ease, opacity 0.5s ease'
    htmlEl.style.height = '0'
    htmlEl.style.opacity = '0'

    htmlEl.addEventListener(
      'transitionend',
      () => {
        document.body.style.overflow = ''
      },
      { once: true },
    )
  }

  return {
    beforeEnter,
    enter,
    leave,
  }
}
