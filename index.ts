// Define basic types for Person, User, and Admin
type Person = {
    name: string;
    age: number;
    type: 'user' | 'admin'; // Common field to distinguish between User and Admin
  };
  
  type User = Person & { type: 'user'; userSpecificProp: string }; // User-specific field
  type Admin = Person & { type: 'admin'; adminSpecificProp: string }; // Admin-specific field
  
  // Utility type to define filter criteria, excluding 'type'
  type Criteria<T extends Person> = Partial<Omit<T, 'type'>>;
  
  // Function Overloads for strong typing
  function filterPersons(
    persons: Person[],
    personType: 'user',
    criteria: Criteria<User>
  ): User[];
  function filterPersons(
    persons: Person[],
    personType: 'admin',
    criteria: Criteria<Admin>
  ): Admin[];
  
  // Function Implementation
  function filterPersons<T extends Person>(
    persons: Person[],
    personType: T['type'],
    criteria: Criteria<T>
  ): T[] {
    return persons
      // Step 1: Filter by personType ('user' or 'admin')
      .filter((person): person is T => person.type === personType)
      // Step 2: Apply additional filtering based on provided criteria
      .filter((person) =>
        Object.entries(criteria).every(
          ([key, value]) => person[key as keyof T] === value
        )
      );
  }
  
  //// Example Usage:
  const persons: (User | Admin)[] = [
    { name: 'destiny', age: 19, type: 'user', userSpecificProp: 'u1' },
    { name: 'daniel', age: 24, type: 'user', userSpecificProp: 'u2' },
    { name: 'angel', age: 19, type: 'user', userSpecificProp: 'u3' },
    { name: 'michael', age: 30, type: 'admin', adminSpecificProp: 'a1' },
    { name: 'sarah', age: 35, type: 'admin', adminSpecificProp: 'a2' },
  ];
  
  // Get Users aged 19
  const users = filterPersons(persons, 'user', { age: 19 });
  console.log('Filtered Users:', users);
  
  // Get Admins with adminSpecificProp 'a1'
  const admins = filterPersons(persons, 'admin', { adminSpecificProp: 'a1' });
  console.log('Filtered Admins:', admins);
  
  // Error: 'type' field can't be used in criteria
  // const invalidFilter = filterPersons(persons, 'user', { type: 'admin' }); // TypeScript Error
  