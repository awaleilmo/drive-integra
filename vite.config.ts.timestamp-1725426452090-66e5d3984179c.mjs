// vite.config.ts
import { defineConfig } from 'file:///C:/project/drive-integrapadma/node_modules/vite/dist/node/index.js'
import { getDirname } from 'file:///C:/project/drive-integrapadma/node_modules/@adonisjs/core/build/src/helpers/main.js'
import inertia from 'file:///C:/project/drive-integrapadma/node_modules/@adonisjs/inertia/build/src/plugins/vite.js'
import vue from 'file:///C:/project/drive-integrapadma/node_modules/@vitejs/plugin-vue/dist/index.mjs'
import adonisjs from 'file:///C:/project/drive-integrapadma/node_modules/@adonisjs/vite/build/src/client/main.js'
var __vite_injected_original_import_meta_url =
  'file:///C:/project/drive-integrapadma/vite.config.ts'
var vite_config_default = defineConfig({
  plugins: [
    inertia({ ssr: { enabled: false } }),
    vue(),
    adonisjs({ entrypoints: ['inertia/app/app.ts'], reload: ['resources/views/**/*.edge'] }),
  ],
  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: {
      '~/': `${getDirname(__vite_injected_original_import_meta_url)}/inertia/`,
    },
  },
})
export { vite_config_default as default }
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxwcm9qZWN0XFxcXGRyaXZlLWludGVncmFwYWRtYVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxccHJvamVjdFxcXFxkcml2ZS1pbnRlZ3JhcGFkbWFcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L3Byb2plY3QvZHJpdmUtaW50ZWdyYXBhZG1hL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB7IGdldERpcm5hbWUgfSBmcm9tICdAYWRvbmlzanMvY29yZS9oZWxwZXJzJ1xuaW1wb3J0IGluZXJ0aWEgZnJvbSAnQGFkb25pc2pzL2luZXJ0aWEvY2xpZW50J1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgYWRvbmlzanMgZnJvbSAnQGFkb25pc2pzL3ZpdGUvY2xpZW50J1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbaW5lcnRpYSh7IHNzcjogeyBlbmFibGVkOiBmYWxzZSB9IH0pLCB2dWUoKSwgYWRvbmlzanMoeyBlbnRyeXBvaW50czogWydpbmVydGlhL2FwcC9hcHAudHMnXSwgcmVsb2FkOiBbJ3Jlc291cmNlcy92aWV3cy8qKi8qLmVkZ2UnXSB9KV0sXG5cbiAgLyoqXG4gICAqIERlZmluZSBhbGlhc2VzIGZvciBpbXBvcnRpbmcgbW9kdWxlcyBmcm9tXG4gICAqIHlvdXIgZnJvbnRlbmQgY29kZVxuICAgKi9cbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnfi8nOiBgJHtnZXREaXJuYW1lKGltcG9ydC5tZXRhLnVybCl9L2luZXJ0aWEvYCxcbiAgICB9LFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1EsU0FBUyxvQkFBb0I7QUFDNVMsU0FBUyxrQkFBa0I7QUFDM0IsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sU0FBUztBQUNoQixPQUFPLGNBQWM7QUFKa0osSUFBTSwyQ0FBMkM7QUFNeE4sSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsU0FBUyxNQUFNLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxTQUFTLEVBQUUsYUFBYSxDQUFDLG9CQUFvQixHQUFHLFFBQVEsQ0FBQywyQkFBMkIsRUFBRSxDQUFDLENBQUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBTS9JLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLE1BQU0sR0FBRyxXQUFXLHdDQUFlLENBQUM7QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
