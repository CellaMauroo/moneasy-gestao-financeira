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

// …interfaces que já existiam (Group, Category, Expense)…

export interface IncomeType {        // análogo a Group / Category
  id: number;
  type_name: string;                 // "Investimento", "Salário", etc.
}

export interface Income {
  id: number;
  income_name: string;
  income_date: string;  // ISO "YYYY-MM-DDTHH:mm:ssZ"
  value: string;
  type: IncomeType;     // objeto aninhado, igual à API de expenses
  user: number;
}
