<template>
    <v-layout>
        <v-flex xs12>
            <v-card>
                <v-card-title>
                    <button @click="get()">kk</button>
                    <h3 class="headline mb-0">{{ user.login }}</h3>
                </v-card-title>
                <v-card-text>
                    <p>{{ user.email }}</p>
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
      get(){
          
          let favoriteAnimesTitles = () => {
              return this.$store.state.favoriteAnimesTitles
          }
          console.log(this.favoriteAnimesTitles)
      }
  },
  computed: {

      favoriteAnimesTitles(){
         
          return this.$store.state.favoriteAnimesTitles
      },
      user() {
        return this.$store.getters.user
      },
      
  },
  created(){
      //setTimeout(() => {
          this.$store.dispatch('getUserFavorities', this.$route.params.id )
            
      //}, 50)
  },
  updated() {
      console.log('updated')

  }
}
</script>
<style lang="scss" scoped>

</style>
