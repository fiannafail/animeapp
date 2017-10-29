<template>
  <div>
      <v-flex v-bind="{ 'xs9' : leftDrawer, 'offset-xs3' : leftDrawer }">
         <v-layout row wrap>
            <v-flex xs3>
               <v-card></v-card>
            </v-flex>
         </v-layout>
      <h2 class="headline">Top rated Animes</h2>
      <v-layout row wrap top-cards>
         <v-flex v-for="(item, index) in topAnimeData" v-bind:key="index" xs2 v-bind="{ 'xs3' : leftDrawer }">
         <v-card>
            <v-card-title primary-title @click="leftColumn(index)">
               <div>
               <p class="mb-0 bold">{{ item.title }}</p>
               </div>
            </v-card-title>
            <img @click="leftColumn(index)" :src="item.image" width="100%">
            <v-card-text>
               <star-rating :increment="0.01" :rating="item.rating" :read-only="true" :max-rating="10" :star-size="13"></star-rating>
            </v-card-text>
         </v-card>
         </v-flex>
        
      </v-layout>
      </v-flex>
       <v-navigation-drawer
         v-model="leftDrawer"
         light
         absolute
         hide-overlay
         persistent
         touchless
         width="350"
         
    >
      <v-list class="pa-1" v-if="leftDrawer">
        <v-list-tile avatar>
          <v-list-tile-content>
            <v-list-tile-title>
               <h6 class="">{{ leftDrawerData.title }}</h6>
               </v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
             <v-btn icon ripple @click="leftDrawer = false">
                <v-icon color="grey lighten-1">close</v-icon>
              </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-list class="pt-0" dense v-if="leftDrawer">
        <v-divider></v-divider>
         <h6 class="headline mt-3 ml-2">{{ leftDrawerData.title }}</h6>
         <img width="100%":src="leftDrawerData.image">
         <v-list-tile-content class="pa-3">
          <span><b>Started at:</b> {{ leftDrawerData.year }}</span>
          <p>{{ leftDrawerData.synopsis }}</p>
         </v-list-tile-content>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
<script>
import StarRating from 'vue-star-rating';
export default {
  name: "main-page",
  data() {
		return {
         leftDrawer: false
		}
  },
	methods: {
      leftColumn(index){
         this.$store.dispatch('showLeftColumn', index)
         console.log(this.leftDrawer)
         this.leftDrawer = true

      },
      getdata(){
			firebase.database().ref('/users/').once('value')
			.then( snapshot => {
				var favoriteAnimes = []
				//console.log(snapshot)
				snapshot.forEach( (child) => {
					const key = child.key
					const childData = child.val()
					console.log(childData.data)
					if(childData.data){
						favoriteAnimes.push(childData.data)
					}
			})
			console.log(favoriteAnimes)
			favoriteAnimes.forEach( item => {
				item
				console.log(item)
			})
			let arr = []		
		
			let myObj = favoriteAnimes[0]
			  Object.keys(myObj).forEach(key => {
				//console.log(key);          // the name of the current key.
				arr.push(myObj[key]);   // the value of the current key.
			});
			console.log(arr)
			})
		}
	},
	created() {
      this.$store.dispatch('getTop')
	},
	computed: {
      topAnimeData() {
         return this.$store.getters.topAnimeData  
     },
      leftDrawerData() {
         return this.$store.getters.leftDrawerData 
	  },

	}
}
</script>
<style lang="scss" scoped>
* {
  font-size: 16px;
  p {
    font-size: 14px;
  }
}
.list__tile__content b {
  display: inline;
}
</style>
