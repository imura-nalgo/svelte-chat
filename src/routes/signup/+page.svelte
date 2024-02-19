<script lang="ts">
	import { auth } from '$lib/firebase';
	import {
		createUserWithEmailAndPassword,
		updateProfile,
		type UserCredential
	} from 'firebase/auth';

	import messageStore from '$stores/message';
	import { goto } from '$app/navigation';

	let email: string | null = null;
	let password: string | null = null;
	let displayName: string | null = null;
	const createAccount = async () => {
		if (auth === null || email === null || password === null) {
			return;
		}

		try {
			const result: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
			await updateProfile(result.user, {
				displayName: displayName
			});
			await goto('/');
		} catch (e) {
			console.error(e);
			messageStore.set({
				message: 'アカウントの作成に失敗しました。',
				type: 'error'
			});
			password = null;
		}
	};
</script>

<div class="card">
	<div class="card-content">
		<div class="row">
			<div class="input-field col s12">
				<input id="email" class="validate" type="email" bind:value={email} required />
				<label for="email">メールアドレス *</label>
			</div>
		</div>
		<div class="row">
			<div class="input-field col s12">
				<input
					id="password"
					class="validate"
					type="password"
					autocomplete="current-password"
					bind:value={password}
					required
				/>
				<label for="password">パスワード *</label>
			</div>
		</div>
		<div class="row">
			<div class="input-field col s12">
				<input id="displayName" type="text" class="validate" bind:value={displayName} required />
				<label for="displayName">表示名 *</label>
			</div>
		</div>
		<div class="row">
			<div class="col s12">
				<button
					class="btn waves-effect waves-light"
					class:disabled={email === null || password === null || displayName === null}
					on:click={createAccount}>アカウント作成</button
				>
			</div>
		</div>
	</div>
</div>
