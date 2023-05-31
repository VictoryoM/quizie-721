export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/quiz',
    '/api/quizScore',
    '/api/openAIQuestion',
    '/dashboard',
    '/api/delete/*',
    '/api/edit/*',
  ],
};
