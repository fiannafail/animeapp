<template>
	<div>
		<v-card>
			<v-card-text>
			<form @submit.prevent="signInUser" v-if="signState == false">
				<v-layout row>
						<v-flex xs4>
							<v-subheader>Email</v-subheader>
						</v-flex>
						<v-flex xs8>
							<v-text-field
								name="input-1"
								label="Enten your email here..."
								id="form2"
								type="email"
								required 
								v-model="user.email"
							></v-text-field>
						</v-flex>
					</v-layout>
					 <v-layout row>
          <v-flex xs4>
            <v-subheader>Password</v-subheader>
          </v-flex>
          <v-flex xs8>
            <v-text-field
              name="input-1"
              label="Enter your password here"
              id="form2"
							required
							type="password"
							v-model="user.password"
            ></v-text-field>
          </v-flex>
        </v-layout>
				<v-btn type="submit" color="primary">Sign In</v-btn>
				<button @click="signInWithGoogle()">Sign In with Google</button>
			</form>
			<v-alert color="success" icon="check_circle" value="true" v-if="signState !== false">
				This is a success alert.
			</v-alert>
			<v-alert color="error" icon="warning" value="true" v-if="signState == false">
				This is a error alert.
			</v-alert>

			</v-card-text>
		</v-card>
	</div>
</template>
<script>
export default {
  name: "",
  data() {
		return {
			show: true,
			displayName: '',
			signSuccess: false,
			signError: false,
			user: {
				password: '',
				email: ''
			}
		}
  },
	methods: {
		signInWithGoogle(){
			this.$store.dispatch('signInWithGoogle')
		},
	  signInUser() {
			this.$store.dispatch('signIn', {email: this.user.email, password: this.user.password})
	    /*firebase.auth().signInWithEmailAndPassword({email: this.user.email, password: this.user.password})
			.then( response => {
				firebase.database().ref('/users/' + response.uid + '/displayName').once('value')
					.then( snapshot => {
						const info = snapshot.val();
						const uid = response.uid;
						console.log(snapshot)
						const login1 = {
							login1: info
						}
						this.$emit('login1', login1);
						this.$store.dispatch('uid', uid)
					});
				const sets = {
					email: response.email,
					uid: response.uid,
					mainPage: true,
					signComplete: true
				}
				this.$emit('addUser', sets);
				this.show = false;
				this.signSuccess = true;
			})
				.catch((err) => {
					this.signError = true;
				})*/
	  }
	},
	computed: {
		signState() {
			return this.$store.state.signState
	  },
	}
}
</script>
<style lang="scss" scoped>
.input-group__input {
		min-width: 250px;
	}
</style>
