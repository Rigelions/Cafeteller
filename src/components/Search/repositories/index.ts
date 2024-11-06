import { Filter } from '@/components/Search/types'
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  QueryConstraint,
  where,
  limit
} from '@firebase/firestore'

const getCafesClientRepository = async (filter: Filter) => {
  const db = getFirestore()
  const cafes = collection(db, 'cafes')
  const queries: QueryConstraint[] = []

  Object.keys(filter).forEach((key) => {
    switch (key) {
      case 'name':
        const nameQuery = [
          where('name_search', '>=', filter[key]?.toLowerCase()),
          where('name_search', '<=', filter[key]?.toLowerCase() + '\uf8ff')
        ]

        queries.push(...nameQuery)
        break
      case 'tags':
        if (filter[key]?.length === 0) break
        queries.push(where('tags', 'array-contains-any', filter[key]))
        break
      case 'provinces':
        if (filter[key]?.length === 0) break
        queries.push(where('administrative_area_level_1', 'in', filter[key]))
        break
      case 'amphoes':
        if (filter[key]?.length === 0) break
        queries.push(where('sublocality_level_1', 'in', filter[key]))
        break
    }
  })

  queries.push(orderBy('updateDate', 'desc'), limit(100))

  return await getDocs(query(cafes, ...queries))
}

export default getCafesClientRepository
