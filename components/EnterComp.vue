<template>
  <div class="enterComp relative z-1 w-full max-w-[1002px] rounded-40 xl:max-w-[610px] s:max-w-[340px]">

    <div class="bg-[#ADD51F] p-20 pr-40 flex items-center justify-between gap-40 rounded-t-40 relative z-5 l:rounded-t-20 s:flex-wrap s:gap-8">
      <div class="flex gap-12 shrink-0">
        <div class="size-48 rounded-12 bg-fire-100/40 p-2">
          <img class="size-full object-cover rounded-8" src="/images/competition/countdown.png" alt="">
        </div>
        <div>
          <p class="font-baloo leading-100 mb-4">Thanks for playing</p>
          <p class="font-monsta text-black text-28 leading-100 l:text-24 s:text-20">Submit scorecard</p>
          <!-- <p class="font-baloo leading-100 mb-4">Weekly competition ends in</p> -->
          <!-- <p class="font-monsta text-black text-28 leading-100 l:text-24 s:text-20">{{ countdown }}</p> -->
        </div>
      </div>

      <!-- <div class="relative z-4">
        <p class="font-baloo leading-120 mb-4">Submit your score on x.com to be in the chance to win prizes.</p>
        <p class="font-baloo leading-120 underline underline-offset-4 peer hover:no-underline">What are the rules?</p>

        <div class="bg-white rounded-8 p-16 absolute w-280 h-200 overflow-y-scroll top-full left-0 z-2 opacity-0 pointer-events-none peer-hover:pointer-events-auto peer-hover:opacity-100 hover:pointer-events-auto hover:opacity-100">
          <ul class="text-12 leading-120 grid gap-12">
            <li>
              <strong class="block mb-4">Register to Participate</strong>
              <p>You must be registered at <a class="underline hover:no-underline" href="https://app.heygeorgia.ai" target="_blank">https://app.heygeorgia.ai</a> with your X account connected to be eligible for prizes. Setup takes less than 2 minutes.</p>
            </li>
            <li>
              <strong class="block mb-4">Collect All Byte Tokens</strong>
              <p>You must collect all 5 Byte tokens during your round to qualify for the leaderboard.</p>
            </li>
            <li>
              <strong class="block mb-4">Stamp Your Card</strong>
              <p>Make sure to submit your scorecard with your X username to be eligible.</p>
            </li>
            <li>
              <strong class="block mb-4">Beta Notice</strong>
              <p>We're still in Beta — if you encounter a glitch, please restart your round.</p>
            </li>
            <li>
              <strong class="block mb-4">Tiebreak Rules</strong>
              <p>In the case of a tie, we'll apply a countback from Hole 9. If scores remain tied, prizes will be evenly split.</p>
            </li>
            <li>
              <strong class="block mb-4">Best Score Only</strong>
              <p>Only your <strong>best score of the week</strong> will be counted on the leaderboard.</p>
            </li>
            <li>
              <strong class="block mb-4">Anti-Cheating Measures</strong>
              <p>Scores are logged with timestamps to prevent cheating or replay manipulation.</p>
            </li>
            <li>
              <strong class="block mb-4">Prize Distribution</strong>
              <p>$GEAI and Byte rewards will be distributed within 48 hours after the leaderboard closes.</p>
            </li>
            <li>
              <strong class="block mb-4">Winner Verification</strong>
              <p>Winners must follow and DM <a class="underline hover:no-underline" href="https://x.com/Georgia_AI" target="_blank">@Georgia_AI</a> with their wallet address within 48 hours to claim prizes.</p>
            </li>
            <li>
              <strong className="block mb-4">$GEAI token value</strong>
              <p>$GEAI token value (in USD) will be fixed based on the price at the close of competition entry.</p>
            </li>
          </ul>
        </div>
      </div> -->

      <div class="absolute inset border-4 border-white rounded-t-40 opacity-50 pointer-events-none z-1 l:rounded-t-20" />
    </div>

    <div class="bg-gradient-to-b from-sky-200 to-sky-100 relative flex rounded-b-40 l:rounded-b-20 s:flex-wrap">

      <div class="grow px-32 py-24 l:px-24 l:pt-20">
        <div class="h-32 w-[132px] mb-8 l:w-112 s:w-88">
          <BaseText :fontSize="fs24" :strokeWidth="3">How To Enter</BaseText>
        </div>

        <div class="flex items-center gap-8 mb-12">
          <img class="size-28 rounded-20 bg-white" src="/images/competition/ball1.png" alt="" />
          <p class="font-baloo text-stone-500 leading-120">Enter your <strong class="text-black">X username</strong> registered with the Rewards Pantry.</p>
        </div>

        <div class="flex gap-12 mb-20">
          <div class="relative w-full max-w-360">
            <input v-model="username" class="font-baloo h-[44px] px-16 w-full rounded-8 bg-white relative z-2" placeholder="Enter your username" />
            <div class="absolute z-1 bg-stone-500/10 -inset-2 rounded-[10px]" />
          </div>
          <button
            class="w-80 h-[44px] bg-white text-white relative rounded-8 group transition-transform hover:-rotate-1 active:scale-[97%]" @click="emit('update:username', username)">
            <BaseText :fontSize="20" :strokeWidth="3" class="relative z-4 transition-transform group-hover:scale-105 group-hover:rotate-1 group-active:scale-[108%]">
              Add
            </BaseText>
            <div class="absolute inset-0 z-2 bg-gradient-to-b from-[#E4FF39] to-[#9FDA0B] rounded-8 transition-opacity group-hover:opacity-80 group-active:opacity-90" />
            <div class="absolute -inset-2 z-1 bg-stone-500 rounded-8 opacity-10 group-hover:scale-x-95 group-hover:scale-y-90 transition-transform" />
            <div class="absolute left-0 right-0 h-8 rounded-1/2 bg-white z-5 -top-2 blur-[2px]" />
          </button>
        </div>

        <div class="flex items-center gap-8 mb-12">
          <img class="size-28 rounded-20 bg-white" src="/images/competition/ball2.png" alt="" />
          <p class="font-baloo text-stone-500 leading-120">Take a screenshot and hit the Post on X button below.</p>
        </div>

        <button
          :class="{ 'pointer-events-none saturate-0': username.length === 0 }"
          class="w-full max-w-360 h-[44px] bg-white text-white relative rounded-8 group transition-transform hover:-rotate-1 active:scale-[97%]" @click="shareToX">
          <BaseText :fontSize="20" :strokeWidth="3" :class="{ 'opacity-50': username.length === 0 }" class="relative z-4 transition-transform group-hover:scale-105 group-hover:rotate-1 group-active:scale-[108%]">
            Post on X.com
          </BaseText>
          <div class="absolute inset-0 z-2 bg-gradient-to-b from-[#E4FF39] to-[#9FDA0B] rounded-8 transition-opacity group-hover:opacity-80 group-active:opacity-90" />
          <div class="absolute -inset-2 z-1 bg-stone-500 rounded-8 opacity-10 group-hover:scale-x-95 group-hover:scale-y-90 transition-transform" />
          <div class="absolute left-0 right-0 h-8 rounded-1/2 bg-white z-5 -top-2 blur-[2px]" />
        </button>
        <p class="font-baloo text-14 text-stone-500 leading-120">(Don't forget to attach your screenshot!)</p>
      </div>

      <!-- <div class="bg-gradient-to-b from-[#1990DD] to-[#1F597F] w-320 pl-28 pr-32 py-24 border-l-4 border-white/40 rounded-br-40 l:w-max l:pl-24 l:pt-20 l:rounded-br-20 s:w-full s:rounded-b-20">
          <div class="h-32 w-72 mb-8 l:w-64 s:w-56">
            <BaseText :fontSize="fs28" :strokeWidth="3">Prizes</BaseText>
          </div>

          <div class="grid gap-12">
            <div v-for="el, i in PRIZES" :key="i" class="flex items-start gap-12">
              <div class="size-40 rounded-8 bg-white/40 shrink-0 p-2">
                <img class="bg-[#ADD51F] size-full object-cover rounded-4" :src="`/images/competition/${el.image}.jpg`" alt="">
              </div>
              <div>
                <p class="font-baloo leading-100 text-white/70 mb-4">{{ el.label }}</p>

                <div :style="{ width: el.width }" class="h-16">
                  <BaseText :fontSize="16" :strokeWidth="3">{{ el.value }}</BaseText>
                </div>

              </div>
            </div>
          </div>
        </div> -->

      <div class="absolute inset border-4 border-t-0 border-white rounded-b-40 opacity-50 pointer-events-none z-1 l:rounded-b-20" />
    </div>

  </div>

</template>

<script setup>
import data from '@data/levels'

const emit = defineEmits(['update:username'])

const props = defineProps({
  state: {
    type: Object,
    default: () => { }
  }
})

const username = ref('')

const PRIZES = [{
  image: "1st",
  label: "1st Place",
  value: "$50 GEAI + 1000 Bytes",
  width: "152px"
}, {
  image: "2nd",
  label: "2nd Place",
  value: "500 Bytes",
  width: "72px"
}, {
  image: "3rd",
  label: "3rd Place",
  value: "250 Bytes",
  width: "72px"
}, {
  image: "4th",
  label: "4th-6th Place",
  value: "100 Bytes",
  width: "70px"
}, {
  image: "5th",
  label: "7th-8th Place",
  value: "50 Bytes",
  width: "62px"
}]

const fs40 = ref(40)
const fs32 = ref(32)
const fs28 = ref(28)
const fs24 = ref(24)
const fs20 = ref(20)
const strokeWidth = ref(3)



const updateFontSizes = () => {
  if (innerWidth > 960) {
    fs40.value = 40
    fs32.value = 32
    fs28.value = 28
    fs24.value = 24
    fs20.value = 20
    strokeWidth.value = 3
  } else if (innerWidth > 600 && innerWidth <= 960) {
    fs40.value = 32
    fs32.value = 24
    fs28.value = 24
    fs24.value = 20
    fs20.value = 20
    strokeWidth.value = 3
  } else {
    fs40.value = 24
    fs32.value = 20
    fs28.value = 20
    fs24.value = 16
    fs20.value = 16
    strokeWidth.value = 2
  }
}

const onResize = () => {
  updateFontSizes()
}

const countdown = ref('')

const updateCountdown = () => {
  const now = new Date()

  // Find next Sunday
  const day = now.getDay()
  const distanceToSunday = (7 - day) % 7 || 7
  const nextSunday = new Date(now)
  nextSunday.setDate(now.getDate() + distanceToSunday)
  nextSunday.setHours(20, 0, 0, 0) // 8PM in local time (we'll convert to BST)

  // Convert nextSunday to BST (Europe/London)
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  const parts = formatter.formatToParts(nextSunday)
  const extract = (type) => parts.find(p => p.type === type)?.value

  const bstDateStr = `${extract('year')}-${extract('month')}-${extract('day')}T${extract('hour')}:${extract('minute')}:${extract('second')}`
  const target = new Date(bstDateStr + 'Z') // UTC time matching BST components

  const diff = target.getTime() - now.getTime()

  if (diff <= 0) {
    countdown.value = "0mins 0secs"
    return
  }

  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (days > 0) countdown.value = `${days} days ${hours} hrs ${minutes} mins ${seconds} secs`
  else if (hours > 0) countdown.value = `${hours} hrs ${minutes} mins ${seconds} secs`
  else if (minutes > 0) countdown.value = `${minutes} mins ${seconds} secs`
  else countdown.value = `0 mins ${seconds} secs`
}


onMounted(() => {
  updateFontSizes()
  updateCountdown()
  setInterval(updateCountdown, 1000)
  window.addEventListener('resize', onResize)
})

const holePars = []
let parTotal = 0

data.levels.forEach((el) => {
  holePars.push(el.par)
  parTotal += el.par
})
const scoreTotal = computed(() => {
  let total = 0
  props.state.scorecard.forEach((el) => {
    total += el.score
  })
  return total
})

const shareToX = () => {
  const finalScore = parTotal - scoreTotal.value

  let underOver = `${(finalScore) > 0 ? '-' : '+'}${Math.abs(finalScore)}`
  if (finalScore === 0) underOver = "0"

  const collectibles = props.state.collectibles.filter(Boolean).length;

  const text = encodeURIComponent([
    `I hit ${scoreTotal.value} / ${underOver} on @georgia_ai Golf Adventure 🏌️‍♀️`,
    `I found ${collectibles} $GEAI Bytes 🍪 out of 5`,
    `Give it a shot yourself!`,
    `Play now for a chance to win weekly prizes! 💰\nhttps://app.heygeorgia.ai/golf/`,
    `#GEAIGolf`
  ].join('\n\n'));
  var tweetUrl = 'https://twitter.com/intent/tweet?&text=' + text;
  window.open(tweetUrl, '_blank', 'width=580,height=600');
}
</script>
