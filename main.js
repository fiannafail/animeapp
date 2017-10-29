import Vue from 'vue'
import App from './App.vue'
import SignIn from './components/SignIn.vue'
import SignUp from './components/SignUp.vue'
import AnimeCard from './components/AnimeCard.vue'
import AnimeSearch from './components/AnimeSearch.vue'
import AnimeSearchResults from './components/AnimeSearchResults.vue'
import MainPage from './components/MainPage.vue'
import UserProfile from './components/UserProfile.vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import StarRating from 'vue-star-rating'
import store from './store'
import Vuetify from 'vuetify'

require("babel-core/register");
require("babel-polyfill");
Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(Vuetify)
Vue.component('star-rating', StarRating);

const router = new VueRouter({
	routes: [
		{ path: '/', component: MainPage },
		{ path: '/animes', component: MainPage },
		{ path: '/sign-in', component: SignIn },
		{ path: '/sign-up', component: SignUp },
		{ path: '/user/:id', name: 'user', component: UserProfile },
		{ path: '/search', components: { search: AnimeSearch, results: AnimeSearchResults, card: AnimeCard} }
	],
	mode: 'history'
})

new Vue({
  el: '#app',
	router,
  render: h => h(App),
	store,
	created(){
		firebase.initializeApp({
			apiKey: "AIzaSyD7NAnw3MenR-haZDX-4KEKNN9geClfDKM",
			authDomain: "newproject-22479.firebaseapp.com",
			databaseURL: "https://newproject-22479.firebaseio.com",
			projectId: "newproject-22479",
			storageBucket: "newproject-22479.appspot.com",
			messagingSenderId: "857718161247"
		});
	}
})
