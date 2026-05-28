export interface LearningModule {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  story: string;
  termIds: string[];
  icon: string;
  color: string;
}

export const learningModules: LearningModule[] = [
  {
    id: 'internet',
    title: 'Как работает интернет',
    subtitle: 'Первый шаг',
    description: '5 терминов, которые объяснят, что происходит, когда вы вводите адрес сайта и нажимаете Enter.',
    story: 'Вы открываете браузер и вводите google.com. Что происходит дальше? От вашего компьютера до сервера Google — целая цепочка технологий. Разберём её по шагам, от простого к сложному.',
    termIds: ['dns', 'http', 'web-server', 'api', 'hosting'],
    icon: '🌐',
    color: 'bg-blue-500',
  },
];

export function getModuleById(id: string): LearningModule | undefined {
  return learningModules.find((m) => m.id === id);
}
