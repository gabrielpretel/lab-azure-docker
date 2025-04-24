<template>
  <main class="app-container">
    <TheNavigation />
    <div class="content-container"><slot /></div>
    <footer>
      <p>
        Designed and brought to life by
        <a href="https://github.com/gabrielpretel/" target="_blank">
          <span>Gabriel Pretel</span> </a
        >.
      </p>
    </footer>
  </main>
</template>

<style>
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  html {
    font-family: 'Anderson Grotesk';
  }

  main {
    min-height: 100dvh;
  }

  h1 {
    font-family: 'Editors Note';
    font-size: 2rem;
    font-weight: 600;
  }

  li {
    list-style-type: none;
  }

  a {
    text-decoration: none;
    transition: all 0.4s ease;
    color: #191919;

    &:hover {
      font-size: 1.1em;
      animation: meAnimation 2s infinite;
    }

    & span {
      font-weight: 900;
      font-style: italic;
    }
  }

  .app-container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 100px 1fr;
    width: 100%;
    height: 100%;
    justify-items: center;
    position: relative;
    z-index: 0;
    overflow: hidden;
  }

  .app-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url(../assets/images/taskly_tree.webp) no-repeat right center;
    background-size: cover;
    opacity: 0.2;
    z-index: -1;
  }

  .content-container {
    padding: 20px;
    max-width: 600px;
    justify-self: center;
    width: 100%;
  }

  footer {
    display: flex;
    justify-content: center;
    background-color: #fff;
    box-shadow: 0px 0px 20px #f9dcd0;
    border: 1px solid #d9c8c05e;
    padding: 18px;
    border-radius: 40px;
    width: 600px;
    margin: 20px;

    p {
      font-weight: 600;
    }
  }

  @keyframes meAnimation {
    0% {
      color: #09122c;
    }
    25% {
      color: #872341;
    }
    50% {
      color: #be3144;
    }
    75% {
      color: #e17564;
    }
    100% {
      color: #09122c;
    }
  }
</style>
