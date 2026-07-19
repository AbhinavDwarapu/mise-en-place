import { useEffect, useRef } from 'react'
import JsBarcode from 'jsbarcode'

export function Barcode({ digits }: { digits: string }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return
    JsBarcode(svgRef.current, digits, {
      format: 'CODE128',
      displayValue: false,
      width: 1,
      height: 48,
      margin: 0,
    })
  }, [digits])

  return <svg ref={svgRef} aria-hidden="true" className="mx-auto block" />
}
