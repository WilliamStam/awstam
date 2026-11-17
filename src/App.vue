<script setup lang="ts">
import NavBar from '@/layout/NavBar.vue';
import Footer from '@/layout/Footer.vue';
</script>

<template>
    <div class="min-vh-100 d-flex flex-column">
        <NavBar/>
        <main id="app-content" class="flex-grow-1 d-flex flex-column">
            <RouterView/>
        </main>
        <Footer/>
    </div>
</template>
