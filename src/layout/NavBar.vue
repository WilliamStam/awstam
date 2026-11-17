<script lang="ts" setup>
const links = [
    {name: 'home', label: 'Home', icon: 'fa-solid fa-house'},
    {name: 'about', label: 'About', icon: 'fa-solid fa-circle-info'},
    {name: 'contact', label: 'Contact', icon: 'fa-solid fa-envelope'},
];
</script>

<template>
    <nav id="app-navbar" class="navbar md:navbar-expand fixed-top">
        <div class="container">
            <router-link :to="{name: 'home'}" class="navbar-brand">
                awstam
            </router-link>

            <button
                aria-controls="navbarDrawer"
                aria-expanded="false"
                aria-label="Toggle navigation"
                class="btn-icon navbar-toggler"
                data-bs-target="#navbarDrawer"
                data-bs-toggle="drawer"
                type="button"
            >
                <span aria-hidden="true" class="navbar-toggler-icon"></span>
            </button>
            <dialog id="navbarDrawer" aria-labelledby="navbarDrawerLabel" class="drawer drawer-top" tabindex="-1">
                <div class="drawer-header">
                    <h5 id="navbarDrawerLabel" class="drawer-title">Menu</h5>
                    <button aria-label="Close" class="btn-close" data-bs-dismiss="drawer" type="button"></button>
                </div>
                <div class="drawer-body mb-2 md:mb-0">
                    <ul class="nav navbar-nav me-auto">
                        <li v-for="link in links" :key="link.name" class="nav-item">
                            <router-link :to="{name: link.name}" class="nav-link">
                                <font-awesome-icon :icon="link.icon" class="me-1"/>
                                {{ link.label }}
                            </router-link>
                        </li>
                    </ul>
                </div>
            </dialog>
        </div>
    </nav>
</template>
