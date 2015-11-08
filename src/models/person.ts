export class Person {
    /**
     * @description Student or staff ID. (学号)
     * @example '2012019050031'
     */
    id: string;
    
    /**
     * @description Name. (姓名)
     * @example '秋彤宇'
     */
    name: string;
    
    /**
     * @description Name of department. (所属部门)
     * @example '通信与信息工程学院'
     */
    deptName: string;
    
    /**
     * @description The role of the person. (职位)
     * @example '本专科生'
     */
    metier: string;
    
    /**
     * @description I don't know. (我也不知道这是什么)
     * @example null
     */
    authorized: any;
    
    /**
     * @description The working place. (工作地点)
     * @example null
     */
    workplace: string;
    
    /**
     * @description I don't known. (我也不知道这是什么)
     * @example '通信与信息工程学院'
     */
    description: string;
    
    /**
     * @description Phone number for work. (工作电话)
     * @example null
     */
    workphone: string;

    constructor(id: string) {
        this.id = id;
    }
}

export class PersonFactory {
    create(id: string) {
        return new Person(id);
    }
}

export const personFactory = new PersonFactory();
