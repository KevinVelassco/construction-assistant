import { getRepository } from 'typeorm';
import { HttpException } from '../common/http-exception';
import { GetParameterValueInput } from '../dto/parameters/get-parameter-value-input.dto';
import { Parameter } from '../entities/parameter.entity';

export class ParameterService {
  static async getParameterValue(
    getParameterValueInput: GetParameterValueInput
  ): Promise<string | null> {
    const parameterRepository = getRepository(Parameter);

    const { name, checkExisting = true } = getParameterValueInput;

    const parameter = await parameterRepository.findOne({
      where: {
        name
      }
    });

    if (checkExisting && !parameter)
      throw new HttpException(404, `can't get the parameter ${name}.`);

    return parameter?.value || null;
  }
}
