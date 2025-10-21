'use client'

import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { FaChevronRight } from 'react-icons/fa'
import { useEventoStore } from '@/stores/evento'

interface BreadcrumbProps {
    nomeLoja?: string
}

export function Breadcrumb({ nomeLoja }: BreadcrumbProps) {
    const pathname = usePathname()
    const params = useParams()
    const idLoja = params?.id as string | undefined
    const idEvento = params?.idEvento as string | undefined

    const { eventoSelecionado } = useEventoStore()

    // Quebra o path e remove 'loja' e '(evento)' dos segmentos visuais
    const segments = pathname
        .split('/')
        .filter(Boolean)
        .filter((segment) => segment !== 'loja' && segment !== '(evento)') // remove os diretórios técnicos

    const buildPath = (index: number) => {
        const pathSegments = segments.slice(0, index + 1)

        // reconstrói o caminho com 'loja' e '(evento)' onde necessário
        const correctedPath = pathSegments.reduce<string[]>((acc, segment, i) => {
            acc.push(segment)

            // adiciona 'loja' entre organizadorHome e idLoja
            if (segment === 'organizadorHome' && pathSegments[i + 1] === idLoja) {
                acc.push('loja')
            }

            // adiciona '(evento)' entre idLoja e idEvento
            if (segment === idLoja && pathSegments[i + 1] === idEvento) {
                acc.push('(evento)')
            }

            return acc
        }, [])

        return '/' + correctedPath.join('/')
    }

    const labelMap: Record<string, string> = {
        organizadorHome: 'Início',
        eventos: 'Gerenciar eventos',
        jogosLoja: 'Cadastro de jogos',
    }

    return (
        <nav className="flex items-center space-x-2 text-sm">
            {segments.map((segment, index) => {
                const isLast = index === segments.length - 1

                const label =
                    segment === idLoja
                        ? nomeLoja || 'Loja'
                        : segment === idEvento
                            ? eventoSelecionado?.nmEvento || 'Evento'
                            : labelMap[segment] || decodeURIComponent(segment)

                return (
                    <span key={index} className="flex items-center text-gray-500">
                        {index > 0 && (
                            <span className="mx-2">
                                <FaChevronRight />
                            </span>
                        )}
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
