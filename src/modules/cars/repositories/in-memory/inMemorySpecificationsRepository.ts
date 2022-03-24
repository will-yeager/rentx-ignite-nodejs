import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';
import { ICreateSpecificationDTO, ISpecificationsRepository } from '@modules/cars/repositories/ISpecificationRepository';

class InMemorySpecificationsRepository implements ISpecificationsRepository {
  specifications: Array<Specification> = new Array<Specification>();

  async create({ name, description }: ICreateSpecificationDTO): Promise<Specification> {
    const specification = new Specification();
    Object.assign(specification, {
      description,
      name,
    });
    this.specifications.push(specification);
    return specification;
  }
  async findByName(name: string): Promise<Specification> {
    return this.specifications.find((specification) => specification.name === name);
  }
  async findByIds(idList: string[]): Promise<Specification[]> {
    const allSpecifications = this.specifications.filter((specification) => idList.includes(specification.id));
    return allSpecifications;
  }
}

export { InMemorySpecificationsRepository };
