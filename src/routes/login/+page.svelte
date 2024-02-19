<script lang="ts">
	import { goto } from '$app/navigation';
	import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
	import messageStore from '$stores/message';

	let email: string;
	let password: string;

	const login = async () => {
		try {
			const auth = getAuth();
			await signInWithEmailAndPassword(auth, email, password);
			await goto('/');
		} catch (e) {
			console.error(e);
			messageStore.set({
				message:
					'ログインに失敗しました。入力したアドレス／パスワードが正しいことを確認してください。',
				type: 'error'
			});
		}
	};
</script>

<div class="card">
	<div class="card-content">
		<div class="row">
			<div class="input-field col s12">
				<input id="email" type="email" class="validate" bind:value={email} />
				<label for="email">メールアドレス</label>
			</div>
		</div>
		<div class="row">
			<div class="input-field col s12">
				<input
					id="password"
					type="password"
					bind:value={password}
					autocomplete="current-password"
				/>
				<label for="password">パスワード</label>
			</div>
		</div>
		<div class="row">
			<div class="col s12">
				<button class="btn waves-effect waves-light" on:click={login}>ログイン</button>
			</div>
		</div>
	</div>
</div>
