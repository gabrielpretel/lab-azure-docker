import vue from 'eslint-plugin-vue'
import prettier from 'eslint-plugin-prettier'
import { defineConfig } from 'eslint-define-config'

export default defineConfig({
  plugins: ['vue', 'prettier'],
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'prettier'],
  rules: {
    'vue/component-tags-order': [
      'error',
      {
        order: ['script', 'template', 'style'],
      },
    ],
    'prettier/prettier': 'error',
  },
})
