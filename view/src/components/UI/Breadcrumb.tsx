'use client'

import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import {FaChevronRight} from 'react-icons/fa'

interface BreadcrumbProps {
    nomeLoja?: string // nome da loja vem por props
}

export function Breadcrumb({ nomeLoja }: BreadcrumbProps) {
    const pathname = usePathname()
    const params = useParams()
    const id = params?.id as string | undefined

    // Quebra o path e remove 'loja'
    const segments = pathname
        .split('/')
        .filter(Boolean)
        .filter((segment) => segment !== 'loja') // remove o diretório "loja"


    const buildPath = (index: number) => {
        const pathSegments = segments.slice(0, index + 1)

        // se existir um id (ex: "123") e antes dele vier "organizadorHome",
        // precisamos reinserir "loja" entre eles
        const correctedPath = pathSegments.reduce<string[]>((acc, segment, i) => {
            acc.push(segment)
            if (segment === 'organizadorHome' && pathSegments[i + 1] === id) {
                acc.push('loja')
            }
            return acc
        }, [])

        return '/' + correctedPath.join('/')
    }


    const labelMap: Record<string, string> = {
        organizadorHome: 'Início',
        jogosLoja: 'Cadastro de jogos',
        evento: 'Gerenciar eventos',
    }

    return (
        <nav className="flex items-center space-x-2 text-sm">
            {segments.map((segment, index) => {
                const isLast = index === segments.length - 1
                const label =
                    segment === id
                        ? nomeLoja || 'Loja'
                        : labelMap[segment] || decodeURIComponent(segment)

                return (
                    <span key={index} className="flex items-center text-gray-500">
                        {index > 0 && <span className="mx-2"><FaChevronRight/></span>}
                        {isLast ? (
                            <span className="text-indigo-400 font-medium capitalize">
                                {label}
                            </span>
                        ) : (
                            <Link
                                href={buildPath(index)}
                                className="hover:text-indigo-400 transition capitalize"
                            >
                                {label}
                            </Link>
                        )}
                    </span>
                )
            })}
        </nav>
    )
}
