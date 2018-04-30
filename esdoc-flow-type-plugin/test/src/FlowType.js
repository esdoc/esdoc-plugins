// @flow
export class TestFlowTypeClass {
  member1: number;

  get getter1(): string {}

  set setter1(v: number) {}

  method1(n: number, x: Foo): string {
    return 'Hello'.repeat(n);
  }

  /**
   * this is method2.
   */
  method2(n: number, x: Foo): string {
    return 'Hello'.repeat(n);
  }

  /**
   * this is method3.
   * @param n - this is n
   * @param x - this is x
   * @return this is return
   */
  method3(n: number, x: Foo): string {
    return 'Hello'.repeat(n);
  }

  /**
   * this is method4.
   * @param t - this is t
   * @param x - this is x
   * @param o - this is o
   * @param q - this is q
   * @return this is return
   */
  method4(t: [number, number], x: Foo<string>, o: string|void, q: THREE.Vector3): ?string {
    return 'Hello'.repeat(t[0]);
  }
}

export function testFlowTypeFunction(n: number, x: Foo): string{}
