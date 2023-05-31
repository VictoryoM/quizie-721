export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/quiz',
    '/dashboard',
    '/api/quizScore',
    '/api/openAIQuestion',
    '/api/delete/delUser',
    '/api/delete/banTopic',
    '/api/delete/eraseData',
    '/api/edit/questionEdit',
  ],
};
