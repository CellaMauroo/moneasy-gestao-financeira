// Em app/types.ts

// Esta interface continua a mesma.
export interface Group {
  id: number;
  group_name: string;
}

// CORREÇÃO: A propriedade 'group' agora é do tipo 'Group'
// para corresponder ao objeto aninhado que a API envia.
export interface Category {
  id: number;
  category_name: string;
  group: Group;
}

// CORREÇÃO: As propriedades 'group' e 'category' também foram
// ajustadas para refletir a estrutura de dados aninhada que
// provavelmente é retornada ao buscar uma lista de despesas.
export interface Expense {
  id: number;
  expense_name: string;
  expense_date: string; // formato ISO "YYYY-MM-DDTHH:mm:ssZ"
  value: string;
  group: Group;       // Espera um objeto Group
  category: Category; // Espera um objeto Category
  user: number;       // O ID do usuário continua sendo um número
}
