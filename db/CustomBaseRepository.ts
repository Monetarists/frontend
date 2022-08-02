import {
	AnyEntity,
	EntityRepository,
	FindOneOptions,
	RequiredEntityData,
	wrap,
} from "@mikro-orm/core";
import {FilterQuery} from "@mikro-orm/core/typings";

export class CustomBaseRepository<
	T extends AnyEntity<T>
> extends EntityRepository<T> {
	async upsert(
		data: RequiredEntityData<T>,
		where: FilterQuery<T>,
		options?: FindOneOptions<T> | undefined,
		flush?: boolean | undefined
	) {
		let e: any = await this.findOne(where, options);

		if (e) {
			wrap(e).assign(data);
		} else {
			e = this.create(data);
		}

		if (typeof flush === "undefined" || flush) {
			await this.persistAndFlush(e);
		}

		return e;
	};

	async findOrCreate(
		data: any,
		where: FilterQuery<T>,
		options?: FindOneOptions<T> | undefined
	) {
		let e = await this.findOne(where, options);

		if (e) {
			wrap(e);
		} else {
			// @ts-ignore
			e = this.create(data);

			// @ts-ignore
			await this.persistAndFlush(e);
		}

		return e;
	};
}
