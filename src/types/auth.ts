export type User = {
	username: string;
	passwordHash: string; // incluye salt y coste
	algorithm: 'bcrypt';
};