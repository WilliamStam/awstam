<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
    <footer id="app-footer" class="border-top py-3">
        <div class="container text-center">
            <span class="text-body-secondary small">
                &copy; {{ currentYear }} awstam. All rights reserved.
            </span>
        </div>
    </footer>
</template>
