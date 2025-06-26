<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { signIn } from '@auth/sveltekit/client';
	import { Key, Mail, Shield, Sparkles, Server } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let { data } = $props();

	let username = $state('');
	let password = $state('');
	let error = $state('');
	let isLoading = $state(false);

	async function handleSubmit() {
		if (!username || !password) {
			error = 'Please fill in all fields';
			return;
		}

		isLoading = true;
		error = '';

		try {
			const result = await signIn('credentials', {
				email: username,
				password,
				callbackUrl: '/admin/dashboard',
				redirect: true
			});
		} catch (e) {
			console.error(e);
			error = 'Invalid credentials. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	async function handleKeycloakLogin() {
		isLoading = true;
		try {
			await signIn('keycloak', { callbackUrl: '/admin/dashboard' });
		} catch (e) {
			console.error(e);
			error = 'Keycloak login failed. Please try again.';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>MarkHoster Admin - Login</title>
	<meta name="description" content="Secure admin login for MarkHoster platform" />
</svelte:head>

<!-- Background with animated gradient -->
<div class="bg-background relative min-h-screen overflow-hidden">
	<!-- Animated background elements -->
	<div class="absolute inset-0">
		<div
			class="bg-primary/20 absolute top-0 -left-4 h-72 w-72 animate-pulse rounded-full opacity-70 mix-blend-multiply blur-xl filter"
		></div>
		<div
			class="bg-accent/30 animation-delay-2000 absolute top-0 -right-4 h-72 w-72 animate-pulse rounded-full opacity-70 mix-blend-multiply blur-xl filter"
		></div>
		<div
			class="bg-secondary/25 animation-delay-4000 absolute -bottom-8 left-20 h-72 w-72 animate-pulse rounded-full opacity-70 mix-blend-multiply blur-xl filter"
		></div>
	</div>

	<!-- Main content -->
	<div class="relative z-10 flex min-h-screen items-center justify-center p-4">
		<div class="w-full max-w-md">
			<!-- Logo/Brand Section -->
			<div class="mb-8 text-center">
				<div
					class="bg-primary mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
				>
					<Server class="text-primary-foreground h-8 w-8" />
				</div>
				<h1 class="text-foreground text-3xl font-bold">MarkHoster</h1>
				<p class="text-muted-foreground mt-2">Admin Portal</p>
			</div>

			<!-- Login Card -->
			<Card
				class="bg-card/80 border-border border shadow-2xl backdrop-blur-sm"
			>
				<CardHeader class="pb-4 text-center">
					<CardTitle
						class="text-card-foreground flex items-center justify-center gap-2 text-2xl font-semibold"
					>
						<Shield class="text-primary h-5 w-5" />
						Welcome Back
					</CardTitle>
					<CardDescription class="text-muted-foreground">
						Sign in to access your admin dashboard
					</CardDescription>
				</CardHeader>
				<CardContent class="space-y-6">
					<!-- Credentials Form -->
					<form onsubmit={handleSubmit} class="space-y-4">
						<div class="space-y-2">
							<Label for="email" class="text-foreground text-sm font-medium">Email Address</Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="admin@example.com"
								bind:value={username}
								disabled={isLoading}
								class="bg-input border-border focus:border-ring focus:ring-ring/20 h-11 transition-colors"
							/>
						</div>

						<div class="space-y-2">
							<Label for="password" class="text-foreground text-sm font-medium">Password</Label>
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="••••••••"
								bind:value={password}
								disabled={isLoading}
								class="bg-input border-border focus:border-ring focus:ring-ring/20 h-11 transition-colors"
							/>
						</div>

						{#if error}
							<div
								class="bg-destructive/10 border-destructive/20 animate-shake rounded-lg border p-3"
							>
								<p class="text-destructive flex items-center gap-2 text-sm">
									<span class="bg-destructive h-1 w-1 rounded-full"></span>
									{error}
								</p>
							</div>
						{/if}

						<Button
							type="submit"
							disabled={isLoading}
							class="bg-primary hover:bg-primary/90 text-primary-foreground h-11 w-full transform font-medium shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
						>
							{#if isLoading}
								<div
									class="border-primary-foreground/30 border-t-primary-foreground mr-2 h-4 w-4 animate-spin rounded-full border-2"
								></div>
								Signing in...
							{:else}
								<Mail class="mr-2 h-4 w-4" />
								Sign In
							{/if}
						</Button>
					</form>

					<!-- Divider -->
					<div class="relative">
						<div class="absolute inset-0 flex items-center">
							<span class="border-border w-full border-t"></span>
						</div>
						<div class="relative flex justify-center text-xs uppercase">
							<span class="bg-card text-muted-foreground px-3 font-medium"> Or continue with </span>
						</div>
					</div>

					<!-- Keycloak Login -->
					<Button
						variant="outline"
						onclick={handleKeycloakLogin}
						disabled={isLoading}
						class="border-border bg-secondary hover:bg-secondary/80 text-secondary-foreground h-11 w-full transform transition-all duration-200 hover:scale-[1.02]"
					>
						{#if isLoading}
							<div
								class="border-secondary-foreground/40 mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
							></div>
						{:else}
							<Key class="mr-2 h-4 w-4" />
						{/if}
						<span>Keycloak SSO</span>
					</Button>

					<!-- Security Notice -->
					<div class="text-muted-foreground flex items-center justify-center gap-2 pt-2 text-xs">
						<Sparkles class="h-3 w-3" />
						<span>Secured with enterprise-grade encryption</span>
					</div>
				</CardContent>
			</Card>

			<!-- Footer -->
			<div class="mt-8 text-center">
				<p class="text-muted-foreground text-sm">© 2025 MarkHoster. All rights reserved.</p>
			</div>
		</div>
	</div>
</div>

<style>
</style>
