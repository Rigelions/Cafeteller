import { Filter } from '@/components/Search/types'
import { Cafe } from '@/types'
import getCafesClientRepository from '@/components/Search/repositories'
import isEmpty from 'lodash.isempty'

interface CommonResponse<T> {
  success: boolean
  code?: string
  data: T
}

export const getCafeService = async (
  filter: Filter
): Promise<CommonResponse<Cafe[]>> => {
  try {
    const _filter: Filter = Object.keys(filter).reduce((acc: Filter, key) => {
      const _key = key as keyof Filter
      if (!isEmpty(filter[_key])) {
        acc[_key] = filter[_key] as string & string[]
      }
      return acc
    }, {})

    if (isEmpty(_filter)) {
      return {
        success: true,
        data: []
      }
    }

    const snapshot = await getCafesClientRepository(filter)
    const data = snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id, review_id: doc.data().reviews.id }
    }) as Cafe[]

    return {
      success: true,
      data
    }
  } catch (error) {
    return {
      success: false,
      data: []
    }
  }
}
