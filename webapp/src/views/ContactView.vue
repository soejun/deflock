<template>
  <v-container class="mb-16 text-center">
    <h1>Contact Us</h1>

    <div>
      <p>
        Have questions about DeFlock? Need help contributing to OpenStreetMap?
      </p>
      <p>
        Reach out using the contact options below.
      </p>
    </div>

    <v-row class="mt-12">
      <v-col cols="12" sm="6">
        <v-card
          variant="outlined"
          append-icon="mdi-open-in-new"
          class="mx-auto my-2"
          href="mailto:contact@deflock.me"
          max-width="344"
          prepend-icon="mdi-email"
          subtitle="contact@deflock.me"
          target="_blank"
          title="Email Us"
        ></v-card>
      </v-col>

      <v-col cols="12" sm="6">
        <v-card
          variant="outlined"
          append-icon="mdi-open-in-new"
          class="mx-auto my-2"
          href="https://discord.gg/aV7v4R3sKT"
          max-width="344"
          subtitle="discord.gg/aV7v4R3sKT"
          target="_blank"
          title="Join our Discord"
        >
          <template v-slot:prepend>
            <v-img class="mr-2" contain width="24" height="24" :src="isDark ? 'icon-discord-white.svg' : 'icon-discord.svg'" />
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  
  <Footer />
</template>

<script setup lang="ts">
import Footer from '@/components/layout/Footer.vue';
import { useTheme } from 'vuetify';

const theme = useTheme();
const isDark = computed(() => theme.name.value === 'dark');
</script>
 
<style lang="css" scoped>
@import url('@/assets/typography.css');
</style>

