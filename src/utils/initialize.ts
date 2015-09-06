import { CourseFactory } from '../models/course';
import { ExceptionFactory } from '../models/exception';
import { NoticeFactory } from '../models/notice';
import { PersonFactory } from '../models/person';
import { User, UserFactory } from '../models/user';

import { Caller } from '../helpers/caller';
import { Cacher } from '../helpers/cacher';
import { Fetcher } from '../helpers/fetcher';
import { Injector } from '../helpers/injector';
import { Seeker } from '../helpers/seeker';

export class Initialize {    
    static init (injector: Injector) {
        injector.register('CourseFactory', CourseFactory);
        injector.register('ExceptionFactory', ExceptionFactory);
        injector.register('NoticeFactory', NoticeFactory);
        injector.register('PersonFactory', PersonFactory);
        injector.register('UserFactory', UserFactory);
        
        injector.register('Caller', Caller);
        injector.register('Cacher', Cacher);
        injector.register('Fetcher', Fetcher);
        injector.register('Injector', Injector);
        injector.register('Seeker', Seeker);
    }
}
