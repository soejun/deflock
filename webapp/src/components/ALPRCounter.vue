<template>
  <div class="counter">
    <span :class="{ mobile: isMobile }" ref="counterEl" class="font-weight-bold">0</span>
    <span class="caption">&nbsp;ALPRs Mapped Worldwide</span>
    <div :class="{ 'fade-in': showFinalAnimation }" class="subheading fade-text">and rapidly growing!</div>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { getALPRCounts } from '@/services/apiService';
import { CountUp } from 'countup.js';

const props = defineProps({
  delayMs: {
    type: Number,
    default: 200,
  }
});

const counterEl: Ref<HTMLElement|null> = ref(null);
const countupOptions = {
  useEasing: true,
  useGrouping: true,
  separator: ',',
  decimal: '.',
  prefix: '',
  suffix: '',
};
let counter: CountUp|undefined = undefined;
interface Counts {
  us?: number;
  worldwide?: number;
}
const counts: Ref<Counts> = ref({
  us: undefined,
  worldwide: undefined,
});
const showFinalAnimation = ref(false);
const { xs: isMobile } = useDisplay();

let timeOfMount: number|undefined = undefined;

onMounted(() => {
  timeOfMount = new Date().getTime();
  getALPRCounts().then((countResponse) => {
    counts.value = countResponse;
    countUp(countResponse);
  });
});

function countUp(newCounts: Counts) {
  if (!newCounts.worldwide) return;
  if (!counterEl.value) {
    console.error('Counter element not found');
    return;
  };

  if (!counter) {
    counter = new CountUp(counterEl.value, newCounts.worldwide, countupOptions);

    if (timeOfMount) {
      const timeSinceMount = new Date().getTime() - timeOfMount;
      if (timeSinceMount < props.delayMs) {
        setTimeout(() => {
          counter?.start();
        }, props.delayMs - timeSinceMount);
      } else {
        counter.start();
      }
    }

    setTimeout(() => {
      showFinalAnimation.value = true;
    }, 2500);
  }
}
</script>

<style scoped>
.counter {
  font-size: 1.5rem;
}

.subheading {
  font-weight: bold;
  font-size: 0.9rem;
}

.fade-text {
  opacity: 0;
  transition: opacity 1s ease;
}

.fade-in {
  opacity: 1;
}

.mobile {
  display: block;
  font-size: 1.2em;
}
</style>
