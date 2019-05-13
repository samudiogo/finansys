import { InMemoryDbService } from 'angular-in-memory-web-api';
export class InMemoryDatabase implements InMemoryDbService {
    createDb() {
        const categories = [
            { id: 1, name: 'Home', description: 'payments of house bills' },
            { id: 2, name: 'Healthy', description: 'payments of healthy bills' },
            { id: 3, name: 'Income', description: 'salaries and other extra incomes' },
            { id: 4, name: 'Retirement Plan', description: 'payments of retirement bills' },
            { id: 5, name: 'Playground', description: 'payments of Playground bills' },
        ];

        return { categories };
    }
}