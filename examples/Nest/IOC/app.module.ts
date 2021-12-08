import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ScopeService } from './scope.service';
import { SingletonService } from './singleton.service';
import { TransientService } from './transient.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [SingletonService, ScopeService, TransientService],
})
export class AppModule {}
