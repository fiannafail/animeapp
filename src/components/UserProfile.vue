<template>
    <v-layout>
        <v-flex xs9>
            <v-card>
                <v-card-title>
                    <h3 class="headline bold mb-0">{{ user.login }}</h3>
                </v-card-title>
                <v-card-text>
                    <p><span class="bold">Email: </span> {{ user.email }}</p>
                </v-card-text>
                 <v-divider></v-divider>
                <v-card-text>
                    <h3 class="headline">Currently Watching</h3>
                     <v-layout row wrap v-for="(item, index) in watchingAnimes" v-bind:key="index"> 
                        <v-flex xs4><p class="subheading">{{ item.anime }}</p></v-flex>
                        <v-flex xs6>
                           <v-progress-linear :value="item.minutesLeft ? 100 - (100 / (item.episodeLength * item.episodeCount) * item.minutesLeft) : 0" height="15" color="primary"></v-progress-linear>
                        </v-flex>
                       <v-flex xs2>
                          <div>{{ item.minutesLeft ? item.minutesLeft / item.episodeLength + ' / ' +  item.episodeCount + ' ep.' : '' }}</div>
                          <p class="body-2">{{ item.minutesLeft ? item.minutesLeft + ' minutes left' : ''}}</p>
                        </v-flex>
                     </v-layout>
                     </v-card-text>
                     <v-divider></v-divider>
                     <v-card-text>
                     <h3 class="headline">Favorite Animes</h3>
                    <v-chip v-for="(item, index) in favoriteAnimesTitles" v-bind:key="index" label class="bold" color="grey lighten-2" text-color="grey darken-4">
                        <v-icon left>label</v-icon>{{ item }}
                    </v-chip>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>


<script>
export default {
 
  name: 'UserProfile',
  data () {
      return {
      }
  },
  methods: {
  },
  computed: {
      watchingAnimes(){
         return this.$store.state.watchingAnimes
      },
      favoriteAnimesTitles(){
         return this.$store.state.favoriteAnimesTitles
      },
      user() {
         return this.$store.getters.user
      }
  },
  created(){
      //setTimeout(() => {
      this.$store.dispatch('getUserFavorities', this.$route.params.id )
      this.$store.dispatch('getUserWatchingsAnime', this.$route.params.id )
      //}, 50)
  },
  updated() {
      console.log('updated')

  }
}
</script>
<style lang="scss" scoped>
.progress-linear {
   margin: 0;
}
</style>
