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
/* ---------- Renda ---------- */
export interface IncomeType {
  id: number;
  type: string;   
}

export interface Income {
  id: number;
  income_name: string;
  income_date: string;   
  value: string;
  type: IncomeType;      
  user: number;
}


export interface SimpleUser {
  id: number;
 username: string;        
}


export interface Post {
  id: number;
  title: string;
  body: string;
  created_at: string;
  user: SimpleUser;       
}

export interface Comment {
  id: number;
  body: string;
  created_at: string;
  user: SimpleUser;      
  post: number;
}
