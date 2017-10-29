import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)


const store = new Vuex.Store({
	plugins: [createPersistedState()],
	state: {
		signState: false,
		results: [],
		selectAnime: {},
		uid: '',
		AnimeArray: [],
		remove: {},
		topAnimeData: [],
		displayedFavorited: [],
		favoriteAnime: [],
		showPanel: false,
		showButtons: false,
		showAnimeCard: false,
		AnimeAdded: [],
		favoritesId: [],
		query: '',
		resultsId: [],
		showButtonsEx: false,
		removeAnime: '',
		signSuccess: false,
		user: [],
		showArray: null,
		favoriteAnimesTitles: '',
		leftDrawerData: [],
		lenghtArr: [],
		countArr: [],
		minutesArr: [],
		watchedData: [],
		watchingsKeys: [],
		watchingAnimes: []
	},
	mutations: {
		set(state, {type, items}) {
			state[type] = items
		},
		setUser (state, payload) {
			state.user = payload
		  },
	},
	getters: {
		results(state) {
			return state.results.map(item => {
				item.attributes.titles
				return item
			})
		},
		topAnimeData(state) {
			return state.topAnimeData.map(item => {
				const anime = {
					title: item.attributes.titles.en ? item.attributes.titles.en : item.attributes.titles.en_jp,
					image: item.attributes.posterImage.small,
					rating: item.attributes.averageRating / 10
				}
				return anime
			})
		},
		leftDrawerData(state){
			return { 
				title: state.leftDrawerData.attributes.titles.en ? state.leftDrawerData.attributes.titles.en : state.leftDrawerData.attributes.titles.en_jp,
				image: state.leftDrawerData.attributes.coverImage.original,
				year: state.leftDrawerData.attributes.startDate,
				synopsis: state.leftDrawerData.attributes.synopsis,

			 }
		},
		user (state) {
			return state.user
		  },
	},
	actions: {
		watching({ commit }, payload) {
			const key = payload
			const results = this.state.results
			const tobeAdd = results[key]
			console.log(tobeAdd)
			let Key = firebase.database().ref().child('users/' + this.state.user.uid + '/watching').push().key
			let array = {
				anime: tobeAdd.attributes.canonicalTitle,
				episodeCount: tobeAdd.attributes.episodeCount,
				id: tobeAdd.id,
				episodeLength: tobeAdd.attributes.episodeLength,
				key: Key
			};
			let updates = {}
			updates['users/' + this.state.user.uid + '/watching/' + Key] = array
			firebase.database().ref().update(updates)
/*
			firebase.database().ref('users/' + this.state.user.uid + '/watching').push({
				anime: tobeAdd.attributes.canonicalTitle,
				episodeCount: tobeAdd.attributes.episodeCount,
				id: tobeAdd.id,
				episodeLength: tobeAdd.attributes.episodeLength
			}) */
		},

		signOut({commit}){
			firebase.auth().signOut().then(function() {
				console.log('Signed Out');
				let dataUser = null
				commit('setUser', dataUser)
			  }, function(error) {
				console.error('Sign Out Error', error);
			  });
		},
		search({ commit }, query) {
			return new Promise((resolve, reject) => {
				console.log(query)
				commit('set', { type: 'query', items: query })
				const resource = Vue.resource('https://kitsu.io/api/edge/anime?page[limit]=10&filter[text]=' + this.state.query)
				resource.get({ query: query }).then(function(response){
					console.log('request', query)
					resolve(response)
					var results = response.data.data;
					commit('set', { type: 'results', items: results })
				}, error => {reject(error)}
			);
		})
		},
		getTop({ commit }){
			const resource = Vue.resource('https://kitsu.io/api/edge/anime?page[limit]=6&sort=-averageRating')
			resource.get().then(function(response){
				let topAnimeData = response.data.data
				console.log(topAnimeData)
				commit('set', { type: 'topAnimeData', items: topAnimeData })
			})
		},
		showLeftColumn({ commit, dispatch }, payload){
			return store.dispatch('getTop').then((response) => {
				let leftDrawerData = this.state.topAnimeData[payload]
				console.log(leftDrawerData)
				commit('set', { type: 'leftDrawerData', items: leftDrawerData })
			})
		 },
		select({ commit }, order) {
			const selectAnime = this.state.results[order]
			//console.log(order);
			//console.log(this.state.results[order]);
			//console.log(selectAnime)
			console.log(this.state.user.uid)
			commit('set', { type: 'selectAnime', items: selectAnime })
		},

		uid({ commit }, uid) {
			var uid1 = uid
			commit('set', { type: 'uid1', items: uid1 })
		},
		add({ commit }, order) {
			let data = this.state.results
			//console.log(order)
			let title = data[order].attributes.titles.en ? data[order].attributes.titles.en : data[order].attributes.titles.en_jp
			let id = data[order].id
         console.log(title, id)
         var timeInMs = Date.now()
         firebase.database().ref('favorities/' + this.state.user.uid).update({
            anime: title,
            timestamp: timeInMs,
            login: this.state.user.uid
		 })
		 let Key = firebase.database().ref().child('favorities/' + this.state.user.uid).push().key
		 let array = {
			 anime: title,
			 episodeCount: tobeAdd.attributes.episodeCount,
			 timestamp: timeInMs,
			 login: this.state.user.uid,
			 key: Key
		 };
		 let updates = {}
		 updates['favorities/' + this.state.user.uid + Key] = array
		 firebase.database().ref().update(updates)

			},
			show({ commit }) {
				var showPanel = true;
				commit('set', { type: 'showPanel', items: showPanel })
			},
			hideButtons({ commit }) {
				var showButtonsEx = false
				console.log('hide bb', showButtonsEx)
				commit('set', { type: 'showButtonsEx', items: showButtonsEx })
			},
			showButtons({ commit }) {
				var showButtonsEx = true
				console.log('hide bb', showButtonsEx)
				commit('set', { type: 'showButtonsEx', items: showButtonsEx })
			},
			showAnimeCard({ commit }) {
				let showAnimeCard = true;
				commit('set', { type: 'showAnimeCard', items: showAnimeCard })
			},
			getFavorites(context, data) {
				return new Promise((resolve, reject) => {

					 firebase.database().ref('/users/' + this.state.user.uid + '/data').once('value')
						 .then( snapshot => {
							 let favoriteAnimes = []
			 				 snapshot.forEach( (child) => {
								const key = child.key
								const childData = child.val()
								favoriteAnimes.push(childData)
								})
							 let favoriteAnime = favoriteAnimes
							 resolve(favoriteAnime);
						 }, error => {
							 reject(error);
						 })
				 })
	   },
	   getWatchings({commit}){
		firebase.database().ref('/users/' + this.state.user.uid + '/watching').once('value')
		.then( snapshot => {
			const watchingsKeys = []
				let data = snapshot.val()
				//console.log(data)
				Object.keys(data).forEach( key => {
					watchingsKeys.push(data[key].key)
					//console.log(data[key].key)
				})
				console.log(watchingsKeys)
				commit('set', { type: 'watchingsKeys', items: watchingsKeys })
		})

			firebase.database().ref('/users/' + this.state.user.uid + '/watching').once('value')
			.then( snapshot => {
				let watchingsArray = []
				snapshot.forEach( (child) => {
					const key = child.key
					const childData = child.val()
					watchingsArray.push(childData)
				})
				console.log(watchingsArray)
				console.log(this.state.resultsId)
				let watchingsId = []
				for (const item in watchingsArray) {
					watchingsId.push(watchingsArray[item].id)
				}
				let commonValues = this.state.resultsId.filter(function(value) {
					return watchingsId.indexOf(value) > -1;
				});
				let showedWatching = []
				for (const item in commonValues) {
					let index = watchingsArray.findIndex(x => x.id == commonValues[item])
					showedWatching.push(watchingsArray[index])
				}
				console.log(commonValues)
				console.log(showedWatching)
				commit('set', { type: 'showedWatching', items: showedWatching })
				/*let indexesOfWatchings = []
				for(let item in showedWatching) {
					//
					let index = this.state.resultsId.findIndex(x => x == showedWatching[item].id)
					indexesOfWatchings[1].push(showedWatching[index])
				}
				console.log(indexesOfWatchings)
				let index = null
				let watchingsIndex = []
				console.log(commonValues)
				for(let item in commonValues) {
					watchingsIndex.push(this.state.resultsId.findIndex(x => x == commonValues[item]))
				}
				console.log(watchingsIndex);
				commit('set', { type: 'watchingsIndex', items: watchingsIndex }) */
			//
			//
				let minutesArr = []
				let minutesArrConst = []
				let mins = []
				let arrMins = []
				let countArrs = ''
				let countArr = []
				let result
				let watchingArr = []
				let fullEpsList = {}
				let epLength = []
				let lenghtArr = []
				let keysArr = []
				let minutesLeft = []
				for (var item in this.state.resultsId) {
					result = showedWatching.filter(fullEpsList => {
						return fullEpsList.id == this.state.resultsId[item]
					});
					let index = result[0]
					if(index){
						mins = index.episodeCount * index.episodeLength
						epLength = index.episodeLength
						lenghtArr.push({length: epLength, id: item})
						countArrs = index.episodeCount
						arrMins.push(mins)
						countArr.push({count: countArrs, id: item})
						fullEpsList = { minutes: mins, id: item, left: index.minutesLeft }
						minutesArr.push(fullEpsList)
						minutesArrConst.push(fullEpsList)
						keysArr.push(index.key)
						
					}
					watchingArr.push(result[0])
					}
				console.log(countArr)
				console.log(lenghtArr)
				console.log(arrMins)
				console.log(minutesArr)
				console.log(keysArr)
				

				commit('set',{ type: 'lenghtArr', items: lenghtArr })
				commit('set',{ type: 'minutesArr', items: minutesArr })
				commit('set',{ type: 'minutesArrConst', items: minutesArrConst })
				commit('set',{ type: 'countArr', items: countArr })
				commit('set',{ type: 'arrMins', items: arrMins })
				commit('set',{ type: 'keysArr', items: keysArr })
				
			})
	   },

       getUserFavorities({ commit }, id ){
         const num = id
         firebase.database().ref('/users/' + num + '/data').once('value')
         .then( spanshot => {
            let favoriteAnimes = []
            spanshot.forEach( (child) => {
             const key = child.key
             const childData = child.val()
             favoriteAnimes.push(childData)
             })
            let favoriteAnimesTitles = []
            for(let i = 0; i < favoriteAnimes.length; i++) {
               let anime = favoriteAnimes[i].anime
               favoriteAnimesTitles.push(anime)
           }
           console.log(favoriteAnimesTitles)
           commit('set',{ type: 'favoriteAnimesTitles', items: favoriteAnimesTitles })
         })
	   },
	   getUserWatchingsAnime({ commit }, uid){
			firebase.database().ref('/users/' + uid + '/watching').once('value')
			.then( spanshot => {
			let watchingAnimes = []
			spanshot.forEach( (child) => {
				const key = child.key
				const childData = child.val()
				watchingAnimes.push(childData)
				})
				console.log(watchingAnimes)

				commit('set',{ type: 'watchingAnimes', items: watchingAnimes })
			})
	   },
		 removeAnime({ commit }, number) {
			 for (let index in this.state.resultsId) {
				 if (index == number) {
				 	var removeId = this.state.resultsId[index]
					 //console.log(removeId)
				 }
			 }
			 var ref = firebase.database().ref('users/' + this.state.user.uid + '/data');
			 console.log(removeId)
			 ref.orderByChild('id').equalTo(removeId).once('value')
            .then(function(snapshot) {
               snapshot.forEach(function(childSnapshot) {
               //remove each child
               ref.child(childSnapshot.key).remove();
               let removeNumber = number
               console.log(removeNumber)
               });
         });
      
         let ref1 = firebase.database().ref('favorities/' + this.state.user.uid);
         ref1.orderByChild('anime').equalTo('Naruto').once('value', snapshot => {
              let updates = {};
              snapshot.forEach(child => updates[child.key] = null);
              ref1.update(updates);
         });
		 },
		 getFavoritesId({ commit, dispatch }, order) {
			 return store.dispatch('getFavorites').then((response) => {
				 let favoriteAnime = response
			 	 commit('set', { type: 'favoriteAnime', items: favoriteAnime })
              console.log(favoriteAnime)
              let favoriteAnimeTitlesWrepeat = []
              for (let i = 0; i < favoriteAnime.length; i++) {
                 let el = favoriteAnime[i].anime
                 favoriteAnimeTitlesWrepeat.push(el)
              }
              let favoriteAnimeTitles = favoriteAnimeTitlesWrepeat.filter(function(item, pos) {
               return favoriteAnimeTitlesWrepeat.indexOf(item) == pos;
           })
           //commit('set', { type: 'favoriteAnimeTitles', items: favoriteAnimeTitles })
            console.log(favoriteAnimeTitles)
				var favoritesId = []
				for (let i = 0; i < favoriteAnime.length; i++) {
               let el = favoriteAnime[i].id
               favoritesId.push(el)
				 }
				 commit('set', { type: 'favoritesId', items: favoritesId })
		 	})
		 },
		 getResultsId({ commit, dispatch }, query1) {
			 return store.dispatch('search', query1).then((response) => {
				console.log('re: request', query1)
			 	let res = this.state.results
				let resultsId = []
				for (var i = 0; i < res.length; i++) {
					const el = res[i].id
					resultsId.push(el)
				}
				console.log(res)
				commit('set', { type: 'resultsId', items: resultsId })
			})

	 },
	 findCommonValues({commit, dispatch}, query) {
		 return dispatch('getFavoritesId').then(() => {
			 return dispatch('getResultsId', query).then(() => {
			 console.log(this.state.resultsId)
			 console.log(this.state.favoritesId)

			 let resultsId = this.state.resultsId
			 let favoritesId = this.state.favoritesId

			 let commonValues = resultsId.filter(function(value) {
					 return favoritesId.indexOf(value) > -1;
			 });
			 console.log(commonValues)

			 var displayedFavorited = [];
			 var i, j;
			 var arr1Length = commonValues.length;
			 var arr2Length = resultsId.length;

			 for (i = 0; i < arr1Length; i++) {
				for (j = 0; j < arr2Length; j++) {
					if (commonValues[i] === resultsId[j]) {
							displayedFavorited.push(j);
					}
				}
			 }
			 console.log(displayedFavorited)
			 commit('set', { type: 'displayedFavorited', items: displayedFavorited })
			 })
		})

	 },
	 addShow({commit, dispatch}, key){
		 let showArray = () => {
			return dispatch('findCommonValues').then(() => {
				for (var i = 0; i < this.displayedFavorited.length; i++) {
					if (this.displayedFavorited[i] == key) {
						return true
					}
				}
			})
		}
		commit('set', { type: 'showArray', items: showArray })
	 },
	 signUp({commit}, payload ) {
		//console.log(payload);
		firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
		.then( (user) => {
			this.show = false;
			const dataUser = {
				uid: user.uid,
				email: user.email,
				login: payload.displayName
			}
			commit('setUser', dataUser)
			console.log(dataUser);
			firebase.database().ref('/users/' + user.uid).set({
				 email: payload.email,
				 displayName: payload.displayName
		   })

         })
		.catch( error => {
         console.log(error);
         if(error.code == 'auth/email-already-in-use') {
            console.log(payload.email, payload.password)
            var credential = firebase.auth.EmailAuthProvider.credential(payload.email, payload.password);
            firebase.auth().currentUser.linkWithCredential(credential)
            .then(function(user) {
			   console.log("Account linking success", user);

             }, function(error) {
               console.log("Account linking error", error);
             });
         }
		});
	 },
	 signInWithGoogle({commit}, payload ) {
		var provider = new firebase.auth.GoogleAuthProvider();
		provider.addScope('profile')
		provider.addScope('email')
		firebase.auth().signInWithPopup(provider).then( result => {
		let user = result.user
		const dataUser = {
			uid: user.uid,
			email: user.email,
			login: user.displayName
			}
			
			commit('setUser', dataUser)
		})
		
	 },
	 signIn({commit}, payload ) {
		firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
		.then( response => {
			firebase.database().ref('/users/' + response.uid + '/displayName').once('value')
				.then( user => {
					const login = user.val();
					const dataUser = {
						uid: response.uid,
						email: response.email,
						login: login
					}
					commit('setUser', dataUser)
					let signState = true
					console.log('success')
					commit('set', { type: 'signState', items: signState })
				});
		})
			.catch((err) => {
				console.log(err)
				let signState = false
				commit('set', { type: 'signState', items: signState })
			})
	 },



	},

})
export default store
