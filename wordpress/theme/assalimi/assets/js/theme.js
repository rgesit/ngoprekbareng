// Interaktivitas tema: tema gelap/terang, jam lokal, reveal, slider testimoni,
// dan form kontak (AJAX ke admin-ajax). Tanpa dependency.
(function () {
  'use strict'

  var root = document.documentElement

  /* ---------------------------------------------------------- Tema */
  function theme() {
    return root.dataset.theme === 'light' ? 'light' : 'dark'
  }

  function syncThemeUI() {
    var current = theme()
    var button = document.querySelector('[data-al-theme-toggle]')
    var sun = document.querySelector('[data-al-icon="sun"]')
    var moon = document.querySelector('[data-al-icon="moon"]')
    var meta = document.getElementById('al-theme-color')

    if (sun) sun.classList.toggle('hidden', current === 'dark')
    if (moon) moon.classList.toggle('hidden', current !== 'dark')
    if (meta) meta.setAttribute('content', current === 'dark' ? '#0b0b0f' : '#f6f5f1')
    document.documentElement.style.colorScheme = current

    if (button) {
      var label = current === 'dark' ? button.dataset.labelDark : button.dataset.labelLight
      if (label) {
        button.setAttribute('aria-label', label)
        button.setAttribute('title', label)
      }
    }
  }

  function setTheme(next) {
    root.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch (error) {}
    syncThemeUI()
  }

  syncThemeUI()

  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-al-theme-toggle]')
    if (!button) return
    event.preventDefault()
    setTheme(theme() === 'dark' ? 'light' : 'dark')
  })

  /* ----------------------------------------------------------- Jam */
  function tick() {
    document.querySelectorAll('[data-al-clock]').forEach(function (node) {
      var tz = node.dataset.tz || 'Asia/Jakarta'
      try {
        node.textContent = new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: tz,
        }).format(new Date())
      } catch (error) {}
    })
  }
  tick()
  window.setInterval(tick, 15000)

  /* -------------------------------------------------- Header scroll */
  var header = document.querySelector('[data-al-header]')
  if (header) {
    var last = window.scrollY
    window.addEventListener(
      'scroll',
      function () {
        var y = window.scrollY
        header.classList.toggle('-translate-y-full', y > last && y > 120)
        last = y
      },
      { passive: true }
    )
  }

  /* -------------------------------------------------------- Reveal */
  var reveals = document.querySelectorAll('.reveal')
  if ('IntersectionObserver' in window && reveals.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px' }
    )
    reveals.forEach(function (node) {
      observer.observe(node)
    })
  } else {
    reveals.forEach(function (node) {
      node.classList.add('is-in')
    })
  }

  /* ------------------------------------------------- Testimoni slider */
  document.querySelectorAll('[data-al-slider]').forEach(function (slider) {
    var slides = slider.querySelectorAll('[data-al-slide]')
    var dots = slider.querySelectorAll('[data-al-dot]')
    var next = slider.querySelector('[data-al-next]')
    if (!slides.length) return
    var index = 0

    function show(target) {
      index = (target + slides.length) % slides.length
      slides.forEach(function (slide, i) {
        slide.classList.toggle('hidden', i !== index)
      })
      dots.forEach(function (dot, i) {
        dot.classList.toggle('w-10', i === index)
        dot.classList.toggle('bg-bg', i === index)
        dot.classList.toggle('w-4', i !== index)
        dot.classList.toggle('bg-bg/30', i !== index)
      })
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i)
      })
    })

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1)
      })
    }
  })

  /* --------------------------------------------------- Form kontak */
  document.querySelectorAll('[data-al-contact]').forEach(function (form) {
    var error = form.querySelector('[data-al-form-error]')
    var done = form.parentElement ? form.parentElement.querySelector('[data-al-form-done]') : null
    form.addEventListener('submit', function (event) {
      event.preventDefault()
      if (typeof AL === 'undefined') return

      var button = form.querySelector('button[type="submit"]')
      var original = button ? button.textContent : ''
      if (button) {
        button.disabled = true
        button.textContent = AL.strings.sending
      }
      if (error) error.classList.add('hidden')

      var data = new URLSearchParams(new FormData(form))
      data.set('action', 'al_contact')
      data.set('nonce', AL.nonce)

      fetch(AL.ajax, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: data.toString(),
      })
        .then(function (response) {
          return response.json().then(function (body) {
            if (!response.ok || !body.success) throw new Error((body.data && body.data.error) || AL.strings.error)
            return body
          })
        })
        .then(function () {
          if (done) {
            form.classList.add('hidden')
            done.classList.remove('hidden')
            done.classList.add('flex')
          } else {
            form.reset()
          }
        })
        .catch(function (err) {
          if (error) {
            error.textContent = err.message || AL.strings.error
            error.classList.remove('hidden')
          }
        })
        .finally(function () {
          if (button) {
            button.disabled = false
            button.textContent = original
          }
        })
    })
  })
})()
