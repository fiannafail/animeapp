<template>
   <v-app>
      <v-toolbar color="white">
         <v-toolbar-title>
            <router-link to="/">
            Titl
            </router-link>
         </v-toolbar-title>
         <v-spacer></v-spacer>
         <v-toolbar-side-icon class="hidden-md-and-up"></v-toolbar-side-icon>
         <v-toolbar-items class="hidden-sm-and-down">
					<form class="form-inline d-flex justify-content-end">
							<div v-if="userIsAuthenticated == false">
                <v-menu content-class="d-flex" offset-y absolute :position-y="64">
                  <v-btn color="primary" dark slot="activator">Sign In</v-btn>
                  <v-list>
                    <v-list-tile class="bold">Sign In, Please.</v-list-tile> 
                    <v-list-tile><v-btn color="primary" @click="signInWithGoogle()">Sign In with Google<img class="icon--right" width="20" src="//www.gstatic.com/mobilesdk/160512_mobilesdk/auth_service_google.svg" dark></v-btn></v-list-tile>
                    <v-list-tile><router-link to="/sign-in"><v-btn small color="primary">Sign In with Email<img width="20" class="email icon--right" src="//www.gstatic.com/mobilesdk/160409_mobilesdk/images/auth_service_email.svg"></svg></v-btn></router-link></v-list-tile>
                    
                  </v-list>
                </v-menu>
							
								
								<router-link to="/sign-up">
									<v-btn flat class="" type="button" name="button" @click="switchSign('sign-up')">Регистрация</v-btn>
								</router-link>
							</div>
							<div v-else>
                     <router-link to="/search">
                        <v-btn flat class="" type="button" name="button">Search</v-btn>
                     </router-link>
                         <v-menu class="text-xs-center"
                              offset-x
                              bottom
                              :close-on-content-click="false"
                              :nudge-left="200"
                              :nudge-bottom="50"
                              :nudge-width="200"
                              v-model="menu"
                           >
                              <v-btn dark color="indigo" dark slot="activator">{{ user.login }}</v-btn>
                              <v-card>
                              <v-list>
                                 <v-list-tile avatar>
                                    <v-list-tile-avatar>
                                    <img src="/static/doc-images/john.jpg" alt="John">
                                    </v-list-tile-avatar>
                                    <v-list-tile-content>
                                    <v-list-tile-title>{{ user.login }}</v-list-tile-title>
                                    <v-list-tile-sub-title>{{ user.email }}</v-list-tile-sub-title>
                                    </v-list-tile-content>
                                    <v-list-tile-action>
                                    <v-btn
                                       icon
                                       :class="fav ? 'red--text' : ''"
                                       @click="fav = !fav"
                                    >
                                       <v-icon>favorite</v-icon>
                                    </v-btn>
                                    </v-list-tile-action>
                                 </v-list-tile>
                              </v-list>
                              <v-divider></v-divider>
                              <v-list>
                                 <v-list-tile>
                                    <v-list-tile-action>
                                    <v-switch v-model="message" color="purple"></v-switch>
                                    </v-list-tile-action>
                                    <v-list-tile-title>Enable messages</v-list-tile-title>
                                 </v-list-tile>
                                 <v-list-tile>
                                    <v-list-tile-action>
                                    <v-switch v-model="hints" color="purple"></v-switch>
                                    </v-list-tile-action>
                                    <v-list-tile-title>Enable hints</v-list-tile-title>
                                 </v-list-tile>
                              </v-list>
                              <v-card-actions>
                                 <v-spacer></v-spacer>
                                 <v-btn flat @click="menu = false">Cancel</v-btn>
                                 <v-btn color="primary" flat @click="menu = false">Save</v-btn>
                              </v-card-actions>
                              </v-card>
                           </v-menu>
                           <v-btn flat color="primary" @click="SignOut">Sign Out</v-btn>
                        <router-link :to="{ name: 'user', params: { id: user.uid } }"><span class="ml-4">{{ user.login }}</span></router-link>
  
								
							</div>
						</form>
         </v-toolbar-items>
      </v-toolbar>
      <main>
		<v-container grid-list-lg>
			<v-layout row wrap>
				<v-flex class="hidden-md-only" v-if="showCard()" v-bind:class="{ 'xs3' : showCard() }">
					
               <router-view v-if="showCard()" class="view three" name="card"></router-view>
				</v-flex>
          <router-view class="view one col-12"></router-view>
          <v-flex xs12>
          <v-layout row wrap class="ma-0">
            <v-flex xs12>
              <router-view class="view two" name="search"></router-view>
              <router-view class="view three" name="results"></router-view>
            </v-flex>
          </v-layout>
          </v-flex>
			</v-layout>
		</v-container>
      </main>
   </v-app>

</template>

<script>

import SignIn from './components/SignIn.vue'
import SignUp from './components/SignUp.vue'
import MainPage from './components/MainPage.vue'
import AnimeCard from './components/AnimeCard.vue'
import UserProfile from './components/UserProfile.vue'
import AnimeSearch from './components/AnimeSearch.vue'
import AnimeSearchResults from './components/AnimeSearchResults.vue'


export default {
  name: 'app',
  data () {
    return {
			login1: '',
			posts: [],
			post: {},
      sign: 'sign-in',
			isMainPage: false,
			signComplete: false,
			displayName: '',
			email: '',
			uid: '',
			showResults: false
    }
  },
	components: {
		AnimeCard,
		AnimeSearch,
		AnimeSearchResults,
		SignIn,
		SignUp,
		MainPage,
    UserProfile
	},
	methods: {
    SignOut(){
      this.$store.dispatch('signOut')
      this.userIsAuthenticated
    },
    getTop(){
      console.log(this.topAnimeData)
    },
    	signInWithGoogle(){
			  this.$store.dispatch('signInWithGoogle')
		},
		/*selectedAnime(index){
			if (this.selected === index)
					this.selected = false;
			this.selected = index;
		},*/
		showRe: function(){
			return this.showPanel
		},
		showCard: function(){
			return this.showAnimeCard
		},
		getSinglePost: function(){
			let resource = this.$resource('https://kitsu.io/api/edge/anime?filter[text]={/query}');
			resource.get({ query: this.inputAnime }).then(function(response){
				console.log(response);
				this.post = response.data.data;
				firebase.database().ref('/users/' + this.uid + '/history').update({
							 anime1: this.post[0].attributes.titles.en
						});
			});

		},
		getAllPosts: function(){
			var options = {
				params: {
					_start: 10,
					_limit: 5
				}
			}
			this.$http.get(this.endpoint)
			.then(function(response){
				console.log(response);
				this.posts = response.data
			}, function(error){

			})
		},
		handleLogin: function(login){
			console.log(login);
		},
	  switchSign(currentSign) {
	    this.sign = currentSign;
	  }
	},
	computed: {
		showPanel(){
			return this.$store.state.showPanel
		},
		showAnimeCard(){
			return this.$store.state.showAnimeCard
    },

		user() {
      return this.$store.getters.user  
	  },
	    userIsAuthenticated () {
     		return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      }
   },
   mounted() {
      console.log(this.user.uid)
   },
   created(){
     
   }
}

</script>

<style lang="scss">
.Item .list__tile {
    height: 80px;
}
.list__tile__action .btn--icon {
  margin: 0;
}
.menu__content--select {
	margin-top: 24px;
}
.input-group--select.input-group--focused .input-group--select__autocomplete, 
.input-group--select:not(.input-group--dirty) .input-group--select__autocomplete {
  font-size: 14px;
}
.container {
    max-width: 1250px;
}
.top-cards .rating-text, .top-cards .star-rating {
  font-weight: 700;
  margin: 0 !important;
  
}
.top-cards .rating-text {
  margin-left: 7px !important;
}
.top-cards .card__text {
  padding: 12px;
}
.top-cards .card__title {
 padding: 14px;
}

.theme--dark.btn {
  color: white !important;
}
.menu {
    display: inline-flex !important;
    align-items: center;
}
a {
   text-decoration: none;
}

.post {
	cursor: pointer;
	margin: 15px 0;
	padding: 5px 0;
}
#app {
   text-decoration: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 0px;
}
.bold, .bold > * {
   font-weight: 600;
}
input[type=text].input-alternate {
	height: 100%
}
button, input, optgroup, select, textarea {
	font-family: Roboto;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 2.5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0
}
.email svg path {
  fill: white;
}
</style>
