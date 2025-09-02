import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BalancesService } from './balances.service';
import { CreateBalanceDto } from './dto/create-balance.dto';

@Controller('balances')
export class BalancesController {
  private readonly logger = new Logger(BalancesController.name);
  constructor(private readonly balancesService: BalancesService) {}

  @MessagePattern('balances')
  async getHello(
    @Payload()
    message: CreateBalanceDto,
  ) {
    this.logger.log(`Message received  ${JSON.stringify(message)}`);

    try {
      await this.balancesService.create(message.Payload);
      this.logger.log('Message processed');
    } catch (err) {
      this.logger.error('Error processing message: ', err);
      throw new BadRequestException(err);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.balancesService.findOne(id);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
