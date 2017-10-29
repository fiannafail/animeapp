<template>
 <v-flex xs12>
  <v-card>
     <v-list three-line>
		<v-list-tile class="Item" v-for="(item, key, index) in results" :key="item.id" @click="">
			<v-list-tile-content>
				<v-list-tile-title @click="selectAnime(key)" class="title normal">
					{{ item.attributes.titles.en ? item.attributes.titles.en : item.attributes.titles.en_jp}}
				</v-list-tile-title>
				<v-list-tile-sub-title>
					<span class="body-2">Average Rating: </span> {{ item.attributes.averageRating }}\100
					<span class="body-2">Popularity Rank: </span> {{ item.attributes.popularityRank }}
				</v-list-tile-sub-title>
			</v-list-tile-content>
			<transition name="fade">
				<v-list-tile-action>
				<div v-if="showButtons() == true" style="display: flex">
					
				<span v-for="(item, index) in minutesArr" :key="index" v-if="item.id == key">
					<v-btn text-color="grey" dark color="blue ligheten-3" small @click="e(index, selected[key])">{{ item.left && item.id == key ? Math.trunc(item.left/60) + ' hours and ' + item.left % 60 + ' minutes left' : '' }} {{ !item.left && item.id == key ? Math.trunc(item.minutes/60) + ' hours and ' + item.minutes % 60 + ' minutes left' : '' }}</v-btn>		
					<transition name="fade">
						<div v-show="showSelector[index]" style="display: flex; margin-top: 5px;">
							<v-select
								v-bind:items="fullEpsList.ep"
								v-model="selected[key]"
								multi-line
								autocomplete
								class="caption"
								placeholder="Pick latest viewed episode"
								persistent-hint
							></v-select>
							<v-btn @click="setNewTimming(index, selected[key])" icon ripple>
								<v-icon color="grey darken-1">fa-thumbs-o-up</v-icon> 
							</v-btn>
						</div>
					</transition>
				</span>
					<v-btn v-if="showWatching(key) !== true" icon ripple slot="activator"  @click="startWatchig(key)">
						<v-icon color="grey lighten-1">watch_later</v-icon>
					</v-btn>
					<transition name="fade">
						<v-tooltip right v-if="showAdd(key) != true" color="light-blue darken-3 light">
						<v-btn icon ripple slot="activator" @click="addToFavorities(key)">
							<v-icon color="grey lighten-1">playlist_add</v-icon>
						</v-btn>
						<span>Add to Favoriries</span>
						</v-tooltip>
						<v-btn small outline v-else @click="remove(key)" color="red darken-1">Remove</v-btn>
					</transition>
				</div>
			
				</v-list-tile-action>
			</transition>
		</v-list-tile>
      </v-list>
   </v-card>
 </v-flex>
</template>
<script>

export default {

	data ()  {
		return {
			uid: '',
			hideRemoveButton: [],
			showAddButton: [],
			addedAnimes: [],
			//watchedData: [],
			//minutesArr: [],
			minutes: [],
			items: [1,2,3],
			el: null,
			selected: [],
			//countArr: [],
			fullEpsList: {},
			thisEpCount: [],
			//lenghtArr: [],
			minutesLeft: '',
			countWatched: '',
			showSelector: []
			
		}
	},
	mounted() {

	},
	created() {

	},
	beforeUpdate() {
		console.log('Before updated')
	},
	updated: function(){

	},
	created: function (){

	},
  name: "AnimeSearchResults",
	methods: {

		setNewTimming(el,key){
			let thatLength = ''
			console.log(this.minutesArrConst[el].minutes, this.minutesArr[el].minutes, this.lenghtArr[el].length, key)
			if(key) {
				thatLength = this.watchedData[el] - this.lenghtArr[el].length * key
				console.log(this.watchingsKeys)
				console.log(this.minutesArr[el])
				this.minutesArr[el].left = thatLength
				console.log(this.watchingsKeys[el],el)
				
				let keysIndex = []
				for (const item in this.keysArr) {
					let index = this.watchingsKeys.findIndex(x => x == this.keysArr[item])
					keysIndex.push(this.watchingsKeys[index])
				}
				const Key = keysIndex[el]
				console.log(Key)
				firebase.database().ref('users/' + this.user.uid + '/watching/' + Key).update({
					minutesLeft: thatLength
				})
			}

			this.showSelector = []
		},
		e(el,key){
			this.showSelector = []
			this.showSelector[el] = true
			console.log(el,key);
			this.thisEpCount = [];
			console.log(this.countArr[el].id);
			for(let i = 1; i < this.countArr[el].count + 1; i++){
				this.thisEpCount.push(i);
			}
			let fullEpsList = {ep: this.thisEpCount, id: this.countArr[el].id};
			//console.log(this.thisEpCount)
			console.log(fullEpsList);
			
			this.fullEpsList = fullEpsList;
			console.log(this.minutesArr);
			this.countWatched = key;
			console.log(this.minutesArrConst[el].minutes);
			console.log(this.minutesArr[el].minutes);
			console.log(this.user)
	console.log(this.watchingsIndex)
			

		},
		showWatching(key){
			for(let item in this.minutesArr) {
				if(this.minutesArr[item].id == key) {
					return true
				}
			}
		},
		getwatch(){
		},
		startWatchig(key) {
			this.$store.dispatch('watching', key)
		},
		showAdd(key) {
			for (var i = 0; i < this.displayedFavorited.length; i++) {
				if (this.displayedFavorited[i] == key) {
					return true
				}
			}
		},
		remove(key){
			this.removeIndex = key;
			this.$store.dispatch('removeAnime', this.removeIndex).then(value => {
				var index = this.displayedFavorited.indexOf(key)
				if (index >= 0) {
					this.displayedFavorited.splice(index, 1)
				}
				console.log(this.displayedFavorited, key)
			})
		},
		showButtons: function(){
			return this.showButtonsEx
		},
		selectAnime(index){
			console.log(this.displayedFavorited)
			const order = index;
			this.$store.dispatch('showAnimeCard')
			this.$store.dispatch('select', order)
		},
		addToFavorities(index){
			const order = index;
			this.$store.dispatch('add', order).then(value => {
				this.displayedFavorited.push(index)
			})
			console.log(this.displayedFavorited)
		},
	},
	computed: {
		user() {
      		return this.$store.getters.user  
	  },
	  	keysArr(){
			return this.$store.state.keysArr
		},
		minutesArrConst(){
			return this.$store.state.minutesArrConst
		},
		showedWatching(){
			return this.$store.state.showedWatching
		},
		showButtonsEx(){
			return this.$store.state.showButtonsEx
		},
		watchingsIndex(){
			return this.$store.state.watchingsIndex
		},
		favoritesId() {
			return this.$store.state.favoritesId
		},
		resultsId() {
			return this.$store.state.resultsId
		},
		query() {
			return this.$store.state.query
		},
		results() {
			return this.$store.getters.results
		},
		favoriteAnime() {
			return this.$store.state.favoriteAnime
		},
		displayedFavorited() {
			return this.$store.state.displayedFavorited
		},
		removeAnime() {
			return this.$store.state.removeAnime
		},
		lenghtArr() {
			return this.$store.state.lenghtArr
		},
		minutesArr() {
			return this.$store.state.minutesArr
		},
		countArr() {
			return this.$store.state.countArr
		},
		watchedData() {
			return this.$store.state.watchedData
		},
		watchingsKeys() {
			return this.$store.state.watchingsKeys
		},
	},
}
</script>
<style lang="scss" scoped>
.normal {
	font-weight: 400
}
.list__tile__sub-title {
  margin-top: 10px;
}
.input-group__input {
	min-width: none;
}
.Item .input-group {
	padding: 0;
}
.Item .btn--flat {
	text-transform: none;
}
.Item .list__tile__title {
	height: auto;
}
.Item .list__tile--link {
	height: auto;
}

.Item .list__tile__action {
	flex-direction: row;
	align-items: flex-start;
}
.tooltip__content {
   font-weight:700;
}
.tooltip__content span {
	font-weight: 700;
	text-transform: uppercase ;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .8s
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0
}
input[autocomplete="on"] {
	font-size: 14px;
}

li {
	list-style: none;
}
</style>
