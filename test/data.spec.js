describe('data', () => {

  it('debería exponer función computeUsersStats en objeto global', () => {
    assert.isFunction(computeUsersStats);
  });

  it('debería exponer función sortUsers en objeto global', () => {
    assert.isFunction(sortUsers);
  });

  it('debería exponer función filterUsers en objeto global', () => {
    assert.isFunction(filterUsers);
  });

  it('debería exponer función processCohortData en objeto global', () => {
    assert.isFunction(processCohortData);
  });

  describe('computeUsersStats(users, progress, courses)', () => {

    const cohort = fixtures.cohorts.find(item => item.id === 'lim-2018-03-pre-core-pw');
    const courses = Object.keys(cohort.coursesIndex);
    const { users, progress } = fixtures;

    it('debería retornar arreglo de usuarios con propiedad stats', () => {
      const processed = computeUsersStats(users, progress, courses);

      assert.equal(users.length, processed.length);

      processed.forEach(user => {
        assert.ok(user.hasOwnProperty('stats'));
        assert.isNumber(user.stats.percent);
        assert.isObject(user.stats.exercises);
        assert.isObject(user.stats.quizzes);
        assert.isObject(user.stats.reads);
      });
    });

    describe('user.stats para el primer usuario en data de prueba - ver carpeta data/', () => {

      const processed = computeUsersStats(users, progress, courses);

      it(
        'debería tener propiedad percent con valor 53',
        () => assert.equal(processed[0].stats.percent, 53)
      );

      it('debería tener propiedad exercises con valor {total: 2, completed: 0, percent: 0}', () => {
        assert.deepEqual(processed[0].stats.exercises, {
          total: 2,
          completed: 0,
          percent: 0,
        });
      });

      it('debería tener propiedad quizzes con valor {total: 3, completed: 2, percent: 67, scoreSum: 57, scoreAvg: 29}', () => {
        assert.deepEqual(processed[0].stats.quizzes, {
          total: 3,
          completed: 2,
          percent: 67,
          scoreAvg: 29,
          scoreSum: 57,
        });
      });

      it('debería tener propiedad reads con valor {total: 11, completed: 6, percent: 55}', () => {
        assert.deepEqual(processed[0].stats.reads, {
          total: 11,
          completed: 6,
          percent: 55,
        });
      });

    });

  });

  describe('sortUsers(users, orderBy, orderDirection)', () => {
    const cohort = fixtures.cohorts.find(item => item.id === 'lim-2018-03-pre-core-pw');
    const courses = Object.keys(cohort.coursesIndex);
    const { users, progress } = fixtures;
    const processed = computeUsersStats(users, progress, courses);
    
    it('debería retornar arreglo de usuarios ordenado por nombre ASC',()=>{
      assert.deepEqual(sortUsers(processed, 'name', 'asc')[0].name, 'ALEXANDRA');
      assert.deepEqual(sortUsers(processed, 'name', 'asc')[677].name, 'zaida');
    });
    
    it('debería retornar arreglo de usuarios ordenado por nombre DESC', () =>{
      assert.deepEqual(sortUsers(processed, 'name', 'dsc')[0].name, 'zaida');
      assert.deepEqual(sortUsers(processed, 'name', 'dsc')[677].name, 'ALEXANDRA');
    })
    
    it('debería retornar arreglo de usuarios ordenado por porcentaje general ASC', () =>{
      assert.deepEqual(sortUsers(processed, 'percent', 'asc')[0].stats.percent, '100');
      assert.deepEqual(sortUsers(processed, 'percent', 'asc')[677].stats.percent, '0');
    });
    
    it('debería retornar arreglo de usuarios ordenado por porcentaje general DESC', ()=>{
      assert.deepEqual(sortUsers(processed, 'percent', 'dsc')[0].stats.percent, '0');
      assert.deepEqual(sortUsers(processed, 'percent', 'dsc')[677].stats.percent, '100');
    });
    
    });
    
/*     describe('filterUsers(users, filterBy)', () => {
      
      it('debería retornar nuevo arreglo solo con usuarios con nombres que contengan string (case insensitive)',() => {
      });
    }); */
    
    describe('processCohortData({ cohortData, orderBy, orderDirection, filterBy })', () => {

      const cohort = fixtures.cohorts.find(item => item.id === 'lim-2018-03-pre-core-pw');
      const { users, progress } = fixtures;
      let options = {
        cohort: cohort,
        cohortData: {
          users: users,
          progress: progress
        },
        orderBy: 'Name',
        orderDirection: 'ASC',
        search: ''
      }
  
      it('debería retornar arreglo de usuarios con propiedad stats y aplicar sort y filter', () => {
  
        const processed = processCohortData(options);
        assert.deepEqual(processed[0].name, 'adriana vizcarra paitán');
        options.search = 'zarela';
        assert.deepEqual(processCohortData(options)[0].name, 'Elizabeth Zarela');
        options.orderBy = 'Name';
        options.orderDirection = 'DES';
        assert.deepEqual(processCohortData(options)[0].name, 'Elizabeth Zarela')
      });
  
    });
    });