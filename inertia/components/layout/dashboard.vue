<script setup>
import layout from './app.vue'
</script>

<template>
  <layout
    style="
      background-image: repeating-linear-gradient(
        45deg,
        var(--fallback-b1, oklch(var(--b1))),
        var(--fallback-b1, oklch(var(--b1))) 13px,
        var(--fallback-b2, oklch(var(--b2))) 13px,
        var(--fallback-b2, oklch(var(--b2))) 14px
      );
      background-size: 40px 40px;
    "
  >
    <nav>
      <div class="navbar bg-base-100 shadow-lg">
        <div class="navbar-start">
          <div class="dropdown">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
              <iconify icon="solar:list-bold-duotone" height="2em" />
            </div>
            <ul
              tabindex="0"
              class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li><a>Homepage</a></li>
              <li><a>Portfolio</a></li>
              <li><a>About</a></li>
            </ul>
          </div>
        </div>
        <div class="navbar-center">
          <a class="btn btn-ghost text-xl">IPM Drive</a>
        </div>
        <div class="navbar-end">
          <button class="btn btn-ghost btn-circle">
            <iconify icon="solar:card-search-line-duotone" height="2em" />
          </button>
          <button class="btn btn-ghost btn-circle">
            <div class="indicator">
              <iconify icon="solar:bell-broken" height="2em" />
              <span class="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>
        </div>
      </div>
    </nav>
    <main>
      <slot />
    </main>
  </layout>
</template>
